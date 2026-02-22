# RBAC — 3 lớp phân quyền SHMS

---

## Lớp 1: UI Sidebar (Angular NAV_ITEMS)

Sidebar chỉ hiển thị menu mà role được phép thấy.

| Menu | ADMIN | DOCTOR | NURSE | PHARMACIST | PATIENT | DATA_ANALYST |
|------|:-----:|:------:|:-----:|:----------:|:-------:|:------------:|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Quản lý Bệnh nhân | ✅ | ✅ | ✅ | — | — | — |
| Giám sát Realtime | ✅ | ✅ | ✅ | — | — | — |
| Hồ sơ Điện tử (EHR) | ✅ | ✅ | ✅ | — | — | — |
| AI Chẩn đoán | ✅ | ✅ | — | — | — | — |
| Lịch hẹn & Hàng đợi | ✅ | ✅ | ✅ | — | ✅ | — |
| Thuốc & Đơn thuốc | ✅ | ✅ | ✅ | ✅ | — | — |
| Phân tích & Báo cáo | ✅ | — | — | — | — | ✅ |
| Cảnh báo & Thông báo | ✅ | ✅ | ✅ | — | — | — |
| Thiết bị IoT | ✅ | ✅ | ✅ | — | — | — |
| Knowledge Graph | ✅ | ✅ | — | — | — | ✅ |
| Người dùng & RBAC | ✅ | — | — | — | — | — |
| Tìm kiếm nâng cao | ✅ | ✅ | ✅ | ✅ | — | — |
| Lưu trữ Y tế | ✅ | ✅ | ✅ | — | — | — |
| Bản đồ Dịch tễ | ✅ | ✅ | — | — | — | ✅ |

---

## Lớp 2: API Endpoint (Spring Security @PreAuthorize)

Route guards phía Angular + `@PreAuthorize` phía Spring Boot. Nếu gõ URL trực tiếp mà không có quyền → redirect về Dashboard (Angular) hoặc HTTP 403 (API).

| Endpoint | ADMIN | DOCTOR | NURSE | PHARMACIST | PATIENT |
|----------|:-----:|:------:|:-----:|:----------:|:-------:|
| **Patient** | | | | | |
| GET /api/v1/patients | ✅ | ✅ | ✅ ward | — | — |
| POST /api/v1/patients | ✅ | ✅ | — | — | — |
| PUT /api/v1/patients/{id} | ✅ | ✅ | ✅ limited | — | — |
| DELETE /api/v1/patients/{id} | ✅ | — | — | — | — |
| **EHR** | | | | | |
| GET /api/v1/ehr/notes/{patientId} | ✅ | ✅ dept | ✅ ward | — | ✅ own |
| POST /api/v1/ehr/notes | ✅ | ✅ | ✅ limited | — | — |
| PUT /api/v1/ehr/notes/{id} | ✅ | ✅ author | — | — | — |
| GET /api/v1/ehr/labs/{patientId} | ✅ | ✅ | ✅ | — | ✅ own |
| **Prescription** | | | | | |
| POST /api/v1/prescriptions | — | ✅ | — | — | — |
| PUT /api/v1/prescriptions/{id}/verify | — | — | — | ✅ | — |
| PUT /api/v1/prescriptions/{id}/dispense | — | — | — | ✅ | — |
| GET /api/v1/prescriptions/{patientId} | ✅ | ✅ | ✅ | ✅ | ✅ own |
| **AI** | | | | | |
| POST /api/v1/ai/symptom-check | ✅ | ✅ | — | — | — |
| POST /api/v1/ai/xray-analyze | ✅ | ✅ | — | — | — |
| POST /api/v1/ai/ecg-classify | ✅ | ✅ | ✅ | — | — |
| POST /api/v1/ai/risk-predict | ✅ | ✅ | — | — | — |
| **Appointment** | | | | | |
| GET /api/v1/appointments | ✅ | ✅ own | ✅ ward | — | ✅ own |
| POST /api/v1/appointments | ✅ | ✅ | ✅ | — | ✅ |
| PUT /api/v1/appointments/{id}/check-in | ✅ | — | ✅ | — | ✅ own |
| **User Management** | | | | | |
| GET /api/v1/users | ✅ | — | — | — | — |
| POST /api/v1/users | ✅ | — | — | — | — |
| PUT /api/v1/users/{id}/roles | ✅ | — | — | — | — |
| PUT /api/v1/users/{id}/status | ✅ | — | — | — | — |
| **Devices** | | | | | |
| GET /api/v1/devices | ✅ | ✅ | ✅ | — | — |
| POST /api/v1/devices/{id}/assign | ✅ | — | ✅ | — | — |
| POST /api/v1/devices/{id}/calibrate | ✅ | — | ✅ | — | — |
| **Alerts** | | | | | |
| GET /api/v1/alerts | ✅ | ✅ dept | ✅ ward | — | — |
| PUT /api/v1/alerts/{id}/ack | ✅ | ✅ | ✅ | — | — |
| POST /api/v1/alerts/rules | ✅ | — | — | — | — |
| **Analytics** | | | | | |
| GET /api/v1/analytics/* | ✅ | limited | — | — | — |
| **Search** | | | | | |
| GET /api/v1/search | ✅ | ✅ | ✅ | ✅ | — |
| **Storage** | | | | | |
| POST /api/v1/storage/upload | ✅ | ✅ | ✅ | — | — |
| GET /api/v1/storage/files | ✅ | ✅ dept | ✅ ward | — | ✅ own |

---

## Lớp 3: Data Row/Column (Service logic)

Ngoài endpoint-level, mỗi service còn filter dữ liệu theo scope:

| Role | Patient data | EHR data | Alert data | Analytics |
|------|-------------|----------|------------|-----------|
| ADMIN | Tất cả bệnh viện | Tất cả | Tất cả | Full dashboards |
| DOCTOR | Department mình | Department mình (author + dept) | Department mình | KPI cá nhân |
| NURSE | Ward mình | Ward mình (read + limited write) | Ward mình | — |
| PHARMACIST | — | Đơn thuốc liên quan | — | — |
| PATIENT | Chỉ hồ sơ mình | Chỉ EHR mình (read-only) | — | — |
| DATA_ANALYST | Anonymized | Anonymized aggregate | Aggregate stats | Full dashboards |

### Ví dụ filter logic trong PatientService:

```java
@Service
public class PatientServiceImpl {

    public Page<PatientDTO> getPatients(UserContext ctx, Pageable pageable) {
        if (ctx.hasRole("ADMIN")) {
            return repo.findAll(pageable);  // tất cả
        }
        if (ctx.hasRole("DOCTOR")) {
            return repo.findByDepartment(ctx.getDepartment(), pageable);
        }
        if (ctx.hasRole("NURSE")) {
            return repo.findByWard(ctx.getWard(), pageable);
        }
        if (ctx.hasRole("PATIENT")) {
            return repo.findById(ctx.getPatientId(), pageable);  // chỉ mình
        }
        throw new AccessDeniedException();
    }
}
```

### JWT payload chứa context:

```json
{
  "sub": "user-001",
  "roles": ["DOCTOR"],
  "department": "Tim mạch",
  "ward": null,
  "hospitalId": "HN-001",
  "exp": 1700000000
}
```

Gateway extract → forward headers:

```
X-User-Id: user-001
X-User-Roles: DOCTOR
X-User-Department: Tim mạch
X-User-Hospital: HN-001
```
