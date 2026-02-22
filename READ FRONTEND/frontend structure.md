# SHMS — Smart Health Management & Monitoring System v1.0

---

## Cấu trúc Frontend khi mở VSCode lần đầu

```
health-intelligence-platform/
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── README.md
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── favicon.ico
│   ├── styles.scss
│   ├── styles-shared.scss
│   ├── assets/
│   │   └── logo.png
│   └── app/
│       ├── app.component.ts
│       ├── app.config.ts
│       ├── app.routes.ts
│       ├── core/
│       │   ├── guards/
│       │   │   └── auth.guard.ts
│       │   ├── interceptors/
│       │   │   └── api.interceptor.ts
│       │   ├── models/
│       │   │   └── index.ts
│       │   ├── mock-data/
│       │   │   ├── index.ts
│       │   │   └── analytics.data.ts
│       │   └── services/
│       │       ├── api.service.ts
│       │       ├── auth.service.ts
│       │       ├── toast.service.ts
│       │       └── websocket.service.ts
│       ├── layouts/
│       │   └── main-layout/
│       │       └── main-layout.component.ts
│       ├── pages/
│       │   ├── login/
│       │   │   ├── login.component.ts
│       │   │   ├── login.component.html
│       │   │   └── login.component.scss
│       │   ├── dashboard/
│       │   │   ├── dashboard.component.ts
│       │   │   ├── dashboard.component.html
│       │   │   └── dashboard.component.scss
│       │   ├── patients/
│       │   │   ├── patients.component.ts
│       │   │   ├── patients.component.html
│       │   │   └── patients.component.scss
│       │   ├── monitoring/
│       │   │   ├── monitoring.component.ts
│       │   │   ├── monitoring.component.html
│       │   │   └── monitoring.component.scss
│       │   ├── ehr/
│       │   │   ├── ehr.component.ts
│       │   │   ├── ehr.component.html
│       │   │   └── ehr.component.scss
│       │   ├── ai-diagnosis/
│       │   │   ├── ai-diagnosis.component.ts
│       │   │   ├── ai-diagnosis.component.html
│       │   │   └── ai-diagnosis.component.scss
│       │   ├── appointments/
│       │   │   ├── appointments.component.ts
│       │   │   ├── appointments.component.html
│       │   │   └── appointments.component.scss
│       │   ├── medications/
│       │   │   ├── medications.component.ts
│       │   │   ├── medications.component.html
│       │   │   └── medications.component.scss
│       │   ├── analytics/
│       │   │   ├── analytics.component.ts
│       │   │   ├── analytics.component.html
│       │   │   └── analytics.component.scss
│       │   ├── alerts/
│       │   │   ├── alerts.component.ts
│       │   │   ├── alerts.component.html
│       │   │   └── alerts.component.scss
│       │   ├── devices/
│       │   │   ├── devices.component.ts
│       │   │   ├── devices.component.html
│       │   │   └── devices.component.scss
│       │   ├── knowledge-graph/
│       │   │   ├── knowledge-graph.component.ts
│       │   │   ├── knowledge-graph.component.html
│       │   │   └── knowledge-graph.component.scss
│       │   ├── users/
│       │   │   ├── users.component.ts
│       │   │   ├── users.component.html
│       │   │   └── users.component.scss
│       │   ├── search/
│       │   │   ├── search.component.ts
│       │   │   ├── search.component.html
│       │   │   └── search.component.scss
│       │   ├── storage/
│       │   │   ├── storage.component.ts
│       │   │   ├── storage.component.html
│       │   │   └── storage.component.scss
│       │   └── gis/
│       │       ├── gis.component.ts
│       │       ├── gis.component.html
│       │       └── gis.component.scss
│       └── shared/
│           ├── components/
│           │   ├── header/
│           │   │   ├── header.component.ts
│           │   │   ├── header.component.html
│           │   │   └── header.component.scss
│           │   ├── sidebar/
│           │   │   ├── sidebar.component.ts
│           │   │   ├── sidebar.component.html
│           │   │   └── sidebar.component.scss
│           │   └── toast/
│           │       └── toast.component.ts
│           ├── directives/
│           └── pipes/
```

---

## Chạy lệnh trong Terminal VSCode

### Bước 1 — Cài dependencies

```bash
npm install
```

Sau lệnh này, thư mục `node_modules/` được sinh ra:

```
health-intelligence-platform/
├── node_modules/           ← SINH RA (~300MB, hàng nghìn packages)
│   └── ...
├── package.json
├── src/
└── ...
```

### Bước 2 — Chạy dev server

```bash
ng serve
```

Sau lệnh này, Angular compiler sinh ra thư mục `.angular/cache/`:

```
health-intelligence-platform/
├── .angular/               ← SINH RA (build cache)
│   └── cache/
│       └── 17.3.x/
│           └── vite/
│               └── deps/
├── node_modules/
├── src/
└── ...
```

Terminal hiển thị:

```
✔ Compiled successfully.
  Local:   http://localhost:4200/
```

Mở trình duyệt → **http://localhost:4200** → Trang đăng nhập.

### Bước 3 (tuỳ chọn) — Build production

```bash
ng build
```

Sinh ra thư mục `dist/`:

```
health-intelligence-platform/
├── dist/                               ← SINH RA
│   └── health-intelligence-platform/
│       └── browser/
│           ├── index.html
│           ├── main-XXXXXXXX.js
│           ├── polyfills-XXXXXXXX.js
│           ├── styles-XXXXXXXX.css
│           ├── chunk-XXXXXXXX.js       ← 26 lazy-loaded chunks (1 per page route)
│           ├── chunk-XXXXXXXX.js
│           ├── ...
│           ├── favicon.ico
│           └── assets/
│               └── logo.png
├── node_modules/
├── src/
└── ...
```

Thư mục `dist/health-intelligence-platform/browser/` chứa static files, deploy lên bất kỳ web server nào (Nginx, Apache, S3, ...).

---

## Frontend tương thích Backend như thế nào

### TypeScript Interfaces ↔ Java DTOs

Mỗi interface trong `src/app/core/models/index.ts` tương ứng 1:1 với Java DTO class phía backend:

```
Frontend (TypeScript)              Backend (Java)
─────────────────────              ──────────────
Patient                       ↔   PatientDTO.java
VitalSign                     ↔   VitalSignDTO.java
VitalStreamMessage            ↔   VitalStreamMessage.java
ClinicalNote                  ↔   ClinicalNoteDTO.java
Diagnosis                     ↔   DiagnosisDTO.java
LabResult                     ↔   LabResultDTO.java
DiagnosisSuggestion           ↔   DiagnosisSuggestion.java
DiagnosisResponse             ↔   DiagnosisResponse.java
Appointment                   ↔   AppointmentDTO.java
QueueUpdate                   ↔   QueueUpdateMessage.java
Drug                          ↔   DrugDTO.java
Prescription                  ↔   PrescriptionDTO.java
DrugInteraction               ↔   DrugInteractionDTO.java
Alert                         ↔   AlertDTO.java
IoTDevice                     ↔   IoTDeviceDTO.java
GraphNode                     ↔   GraphNodeDTO.java
GraphRelationship             ↔   GraphRelationshipDTO.java
StorageFile                   ↔   StorageFileDTO.java
HospitalLocation              ↔   HospitalLocationDTO.java
SearchResult                  ↔   SearchResultDTO.java
User                          ↔   UserDTO.java
LoginRequest / LoginResponse  ↔   AuthRequest.java / AuthResponse.java
```

### API Service ↔ Spring Cloud Gateway

File `src/app/core/services/api.service.ts` hiện đang trả mock data. Khi chuyển sang production, mỗi method sẽ gọi REST API qua Spring Cloud Gateway (port 8080):

```
Frontend method               →  Gateway route            →  Microservice
───────────────               ─  ─────────────            ─  ────────────
getPatients()                 →  GET  /api/v1/patients    →  patient-service:8081
getPatient(id)                →  GET  /api/v1/patients/id →  patient-service:8081
getClinicalNotes(patientId)   →  GET  /api/v1/ehr/notes   →  ehr-service:8082
getDiagnoses(patientId)       →  GET  /api/v1/ehr/dx      →  ehr-service:8082
getLabResults(patientId)      →  GET  /api/v1/ehr/labs    →  ehr-service:8082
getAppointments()             →  GET  /api/v1/appointments →  appointment-service:8084
getDrugs()                    →  GET  /api/v1/drugs       →  medication-service:8085
checkDrugInteraction(d1,d2)   →  POST /api/v1/drugs/check →  medication-service:8085
getAlerts()                   →  GET  /api/v1/alerts      →  notification-service:8086
runSymptomCheck(symptoms)     →  POST /api/v1/ai/symptom  →  ai-gateway:8088 → gRPC → Ray Serve
getDevices()                  →  GET  /api/v1/devices     →  device-service:8087
getStorageFiles()             →  GET  /api/v1/storage     →  storage-service:8090
getGraphData()                →  GET  /api/v1/graph       →  graph-service → Neo4j Bolt
getHospitals()                →  GET  /api/v1/gis         →  gis-service:8091
search(query)                 →  GET  /api/v1/search      →  search-service:8089 → Elasticsearch
getUsers()                    →  GET  /api/v1/users       →  user-service:8083
```

### WebSocket STOMP ↔ Spring WebSocket

File `src/app/core/services/websocket.service.ts` hiện mock data bằng `interval()`. Khi production, connect tới Spring WebSocket:

```
Frontend subscription                          Backend STOMP topic
─────────────────────                          ───────────────────
subscribeVitals(patientId)                  →  /topic/patient/{id}/vitals
(planned) subscribeAlerts(patientId)        →  /topic/patient/{id}/alerts
(planned) subscribeQueue(doctorId)          →  /topic/doctor/{id}/queue
(planned) subscribeWardOverview(wardId)     →  /topic/ward/{id}/overview
(planned) subscribeAnalytics()              →  /topic/analytics/hospital-overview
(planned) subscribeDeviceStatus(deviceId)   →  /topic/devices/{id}/status
```

### JWT Auth ↔ Spring Security

File `src/app/core/services/auth.service.ts` hiện mock JWT. Khi production:

```
Login flow:
  Angular LoginComponent
    → POST /api/v1/auth/login (username, password)
    → Spring Security validates → returns JWT token
    → Angular stores JWT in localStorage
    → api.interceptor.ts gắn header: Authorization: Bearer <token>
    → Mọi API call đều kèm JWT
    → Spring Cloud Gateway verify JWT trước khi forward tới microservice
```

### Kafka Events (frontend nhận qua WebSocket)

Frontend không gọi Kafka trực tiếp. Backend xử lý Kafka, rồi push kết quả qua WebSocket:

```
IoT Device → MQTT → Kafka (vital.raw)
  → Flink processing → Kafka (vital.processed)
    → Spring WebSocket → STOMP → Angular (Chart.js realtime update)

Alert triggered → Kafka (alert.created)
  → Notification Service → WebSocket → Angular (Toast + Bell notification)
```

### Chuyển từ Mock sang Production

Chỉ cần sửa 2 file:

```
src/app/core/services/api.service.ts
  Thay: return of(MOCK_DATA).pipe(delay(300))
  Bằng: return this.http.get<T>('/api/v1/...')

src/app/core/services/websocket.service.ts
  Thay: interval(2000).subscribe(...)
  Bằng: SockJS + @stomp/stompjs connect tới ws://gateway:8080/ws
```

File `src/app/core/interceptors/api.interceptor.ts` đã sẵn sàng gắn JWT header và xử lý 401 redirect.
