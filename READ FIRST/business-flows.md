# Luồng nghiệp vụ chính SHMS

---

## 1. Luồng chăm sóc bệnh nhân (End-to-end)

```
Bệnh nhân đến
    │
    ▼
[1] Quét QR check-in ──REST POST──▶ patient-service
    │                               Load hồ sơ từ Redis cache
    ▼
[2] AI Triage ──REST──▶ ai-gateway ──gRPC──▶ ml-service
    │                   Manchester Scale 5 mức
    │                   Risk score tính toán
    ▼
[3] Check-in lịch hẹn ──REST POST──▶ appointment-service
    │                    ──WebSocket──▶ Cập nhật số thứ tự
    │                                  Màn hình lễ tân + app BN
    ▼
[4] Gắn thiết bị monitor
    │  IoT ──MQTT──▶ device-service ──Kafka [vital.raw]──▶ Flink
    │                                    ──Kafka [vital.processed]──▶ WebSocket
    │                                                                  Dashboard realtime
    ▼
[5] Bác sĩ khám ──REST POST──▶ ehr-service
    │              Nhập SOAP note (Subjective/Objective/Assessment/Plan)
    │              Kafka [ehr.audit] → audit log
    ▼
[6] AI gợi ý chẩn đoán ──REST──▶ ai-gateway ──gRPC──▶ ml-service
    │                     Top-5 ICD-10 + confidence score
    ▼
[7] Bác sĩ kê đơn
    │  ├── Drug interaction check ──Neo4j Bolt──▶ graph-service
    │  ├── Allergy check ──Redis──▶ patient cache
    │  └── If conflict → WebSocket alert popup
    ▼
[8] Xác nhận đơn thuốc ──REST POST──▶ medication-service
    │                     Kafka [prescription.created]
    │                     ──▶ Dược sĩ nhận WebSocket notification
    ▼
[9] Upload X-ray ──REST multipart──▶ storage-service ──S3──▶ Ceph
    │               URL index ──▶ Elasticsearch
    ▼
[10] Kết thúc khám ──REST PUT──▶ appointment-service
     │                Kafka [appointment.completed]
     │                ──▶ Flink analytics aggregation
     ▼
[11] Xuất viện
     │  Generate PDF ──▶ Ceph S3
     │  Email link ──▶ notification-service
     └── Hẹn tái khám ──▶ appointment-service
```

---

## 2. Luồng cảnh báo khẩn cấp

```
IoT Device (SpO2 < 90%)
    │ MQTT
    ▼
device-service ──Kafka [vital.raw]──▶ Flink
    │
    ▼
Flink anomaly detection
    ├── Threshold check: SpO2 < 90 → CRITICAL
    ├── ML anomaly score > 0.8 → flag
    │
    ▼
Kafka [vital.alert] ──▶ notification-service
    │
    ├── WebSocket push ──▶ Nurse dashboard (blink + audio)
    ├── WebSocket push ──▶ Bác sĩ phụ trách
    ├── SMS ──▶ Y tá trực (SĐT)
    ├── Redis ──▶ Lưu unacknowledged alert
    └── PostgreSQL ──▶ Lưu alert history
    │
    ▼
Nurse xác nhận (ACK)
    │  WebSocket /app/vitals/ack
    ▼
notification-service
    ├── Redis: remove từ unacknowledged
    ├── PostgreSQL: update status → ACKNOWLEDGED
    └── Kafka [alert.acknowledged] → audit log
```

---

## 3. Luồng kê đơn thuốc & kiểm tra tương tác

```
Bác sĩ chọn thuốc trên UI
    │
    ▼
Angular ──REST POST /api/v1/drugs/check──▶ medication-service
    │
    ▼
medication-service
    ├── Neo4j Bolt query:
    │   MATCH (d1:Drug)-[:INTERACTS_WITH]->(d2:Drug)
    │   WHERE d1.name = $drug1 AND d2.name = $drug2
    │   RETURN interaction.severity, interaction.mechanism
    │
    ├── Redis check: patient allergies cache
    │
    └── Response: { interactions: [...], allergies: [...] }
    │
    ▼
Angular UI
    ├── Nếu MAJOR → popup đỏ + block submit
    ├── Nếu MODERATE → warning vàng + cho phép override
    └── Nếu safe → submit đơn thuốc
    │
    ▼
medication-service ──REST POST──▶ Tạo Prescription
    │  Kafka [prescription.created]
    ▼
notification-service ──WebSocket──▶ Dược sĩ nhận thông báo
    │
    ▼
D�ợc sĩ verify + dispense
    │  REST PUT /api/v1/prescriptions/{id}/dispense
    │  Kafka [prescription.dispensed]
    ▼
Analytics aggregation (Flink)
```

---

## 4. Luồng tìm kiếm toàn hệ thống

```
User nhập query trên Header search bar
    │
    ▼
Angular ──REST GET /api/v1/search?q=xxx&type=all──▶ search-service
    │
    ▼
search-service
    ├── Elasticsearch multi-index query:
    │   ├── patients index (name, ID, phone, ward)
    │   ├── drugs index (name, ATC code, active ingredient)
    │   ├── diagnoses index (ICD-10 code, description)
    │   └── ehr index (SOAP notes full-text)
    │
    ├── Score & rank results
    ├── Highlight matched terms
    └── Response: SearchResult[] with type badges
    │
    ▼
Angular UI: dropdown results grouped by type
    └── Click → navigate to detail page
```

---

## 5. Luồng đăng nhập & phân quyền

```
User nhập username/password
    │
    ▼
Angular ──REST POST /api/v1/auth/login──▶ user-service
    │
    ▼
user-service
    ├── Validate credentials (BCrypt)
    ├── Check account status (ACTIVE/LOCKED)
    ├── Generate JWT token:
    │   { sub: userId, roles: ["DOCTOR"], dept: "Tim mạch", exp: 24h }
    ├── Redis: store session (TTL 24h)
    └── Response: { token, user }
    │
    ▼
Angular
    ├── localStorage.setItem('shms_user', user)
    ├── api.interceptor.ts: gắn Authorization: Bearer <token>
    ├── Sidebar: filter NAV_ITEMS theo user.roles
    └── Route guards: roleGuard check trước khi vào page
    │
    ▼
Mọi API call tiếp theo:
    Angular ──Authorization: Bearer <JWT>──▶ Gateway
        │
        ▼
    Gateway JwtAuthenticationFilter
        ├── Verify signature
        ├── Check expiration
        ├── Extract roles
        └── Forward request + X-User-Id + X-User-Roles headers
            │
            ▼
        Microservice: @PreAuthorize("hasRole('DOCTOR')")
```

---

## 6. Luồng Knowledge Graph query

```
Bác sĩ mở Knowledge Graph page
    │
    ▼
Angular ──REST GET /api/v1/graph──▶ graph-service
    │
    ▼
graph-service ──Neo4j Bolt──▶ Neo4j 5
    │
    │  Cypher: MATCH (d:Disease)-[r]-(n)
    │          WHERE d.name CONTAINS $query
    │          RETURN d, r, n LIMIT 50
    │
    └── Response: { nodes: GraphNode[], relationships: GraphRelationship[] }
    │
    ▼
Angular D3.js
    ├── d3.forceSimulation() render graph
    ├── Color by nodeType (Disease=blue, Drug=green, Symptom=yellow)
    ├── Click node → show details
    └── Hover relationship → show type (TREATS, CAUSES, INTERACTS_WITH)
```

---

## 7. Luồng upload & xem ảnh y tế

```
Bác sĩ upload X-ray trên Storage page
    │
    ▼
Angular ──REST POST multipart /api/v1/storage/upload──▶ storage-service
    │
    ▼
storage-service
    ├── Generate pre-signed URL
    ├── Upload binary → Ceph S3 bucket: shms-medical-files/
    ├── Save metadata → PostgreSQL (StorageFile record)
    ├── Index metadata → Elasticsearch
    └── Kafka [file.uploaded] → audit log
    │
    ▼
Response: { fileId, preSignedUrl, metadata }
    │
    ▼
Angular Storage page: hiển thị file list
    └── Click file → pre-signed URL → browser renders/downloads
```

---

## 8. Luồng giám sát phòng bệnh (Ward Overview)

```
Nurse mở Monitoring page → chọn "Phòng bệnh" view
    │
    ▼
Angular ──WebSocket subscribe /topic/ward/{wardId}/overview──▶ Gateway
    │
    ▼
Flink vital-stream-processor
    ├── Aggregate all patients in ward
    ├── Traffic light status per patient:
    │   🟢 Normal  🟡 Warning  🔴 Critical
    ├── Kafka [vital.processed] → WebSocket relay
    │
    ▼
Angular Monitoring page
    ├── Grid view: mỗi patient = 1 cell
    ├── Realtime update HR, SpO2, BP, Temp
    ├── Critical patients: red glow animation
    └── Click patient → switch to Single Patient View (4 charts)
```
