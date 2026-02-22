# API Contracts — 124 REST Endpoints

---

## Conventions

### Base URL

```
Production:  https://shms.hospital.vn/api/v1
Development: http://localhost:8080/api/v1
```

### Auth Header

```
Authorization: Bearer <JWT_TOKEN>
```

### Pagination

```
GET /api/v1/patients?page=0&size=20&sort=createdAt,desc

Response:
{
  "content": [...],
  "page": 0,
  "size": 20,
  "totalElements": 156,
  "totalPages": 8
}
```

### Error Format

```json
{
  "timestamp": "2024-10-15T08:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "code": "PATIENT_NOT_FOUND",
  "message": "Không tìm thấy bệnh nhân P-001",
  "path": "/api/v1/patients/P-001"
}
```

### HTTP Status Codes

| Code | Ý nghĩa |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content (delete) |
| 400 | Bad Request (validation) |
| 401 | Unauthorized (no/invalid token) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

---

## Endpoints by Service

### Patient Service (8081) — 12 endpoints

```
GET    /api/v1/patients                          Danh sách BN (paginated, filterable)
GET    /api/v1/patients/{id}                     Chi tiết BN
POST   /api/v1/patients                          Tạo BN mới
PUT    /api/v1/patients/{id}                     Cập nhật BN
DELETE /api/v1/patients/{id}                     Xóa BN (soft delete)
GET    /api/v1/patients/{id}/allergies           Danh sách dị ứng
POST   /api/v1/patients/{id}/allergies           Thêm dị ứng
GET    /api/v1/patients/{id}/contacts            Liên hệ người thân
POST   /api/v1/patients/{id}/qr-checkin         Check-in bằng QR
GET    /api/v1/patients/{id}/risk-score          Risk score hiện tại
GET    /api/v1/patients/{id}/family-network      Family network graph
GET    /api/v1/patients/statistics               Thống kê tổng quan
```

### EHR Service (8082) — 14 endpoints

```
GET    /api/v1/ehr/{patientId}/notes             SOAP notes
POST   /api/v1/ehr/{patientId}/notes             Tạo SOAP note
PUT    /api/v1/ehr/notes/{noteId}                Sửa SOAP note
POST   /api/v1/ehr/notes/{noteId}/lock           Lock note (read-only)
POST   /api/v1/ehr/notes/{noteId}/addendum       Thêm addendum
GET    /api/v1/ehr/{patientId}/diagnoses         Danh sách chẩn đoán
POST   /api/v1/ehr/{patientId}/diagnoses         Thêm chẩn đoán
GET    /api/v1/ehr/{patientId}/labs              Kết quả xét nghiệm
POST   /api/v1/ehr/{patientId}/labs              Thêm kết quả XN
GET    /api/v1/ehr/{patientId}/imaging           Hình ảnh y khoa
GET    /api/v1/ehr/{patientId}/procedures        Thủ thuật đã làm
GET    /api/v1/ehr/{patientId}/timeline          Timeline tổng hợp
GET    /api/v1/ehr/notes/{noteId}/history        Version history
POST   /api/v1/ehr/{patientId}/export-pdf        Export PDF summary
```

### User Service (8083) — 14 endpoints

```
POST   /api/v1/auth/login                        Đăng nhập
POST   /api/v1/auth/logout                       Đăng xuất
POST   /api/v1/auth/refresh                      Refresh token
POST   /api/v1/auth/otp/send                     Gửi OTP
POST   /api/v1/auth/otp/verify                   Xác thực OTP
GET    /api/v1/users                              Danh sách users
GET    /api/v1/users/{id}                         Chi tiết user
POST   /api/v1/users                              Tạo user
PUT    /api/v1/users/{id}                         Cập nhật user
PUT    /api/v1/users/{id}/roles                   Gán roles
PUT    /api/v1/users/{id}/status                  Đổi trạng thái
PUT    /api/v1/users/{id}/password                Đổi mật khẩu
GET    /api/v1/users/{id}/sessions                Phiên đang hoạt động
DELETE /api/v1/users/{id}/sessions/{sessionId}    Kick session
```

### Appointment Service (8084) — 12 endpoints

```
GET    /api/v1/appointments                       Danh sách (filter: doctor, date, status)
GET    /api/v1/appointments/{id}                  Chi tiết
POST   /api/v1/appointments                       Đặt lịch
PUT    /api/v1/appointments/{id}                  Cập nhật
PUT    /api/v1/appointments/{id}/check-in         Check-in
PUT    /api/v1/appointments/{id}/start            Bắt đầu khám
PUT    /api/v1/appointments/{id}/complete          Hoàn thành
PUT    /api/v1/appointments/{id}/cancel            Hủy
GET    /api/v1/appointments/queue/{doctorId}       Hàng đợi bác sĩ
GET    /api/v1/appointments/today                  Lịch hôm nay
GET    /api/v1/appointments/statistics             Thống kê
POST   /api/v1/appointments/{id}/teleconsult       Tạo phòng khám từ xa
```

### Medication Service (8085) — 15 endpoints

```
GET    /api/v1/drugs                              Danh mục thuốc
GET    /api/v1/drugs/{id}                         Chi tiết thuốc
GET    /api/v1/drugs/search?q=xxx                 Tìm thuốc
POST   /api/v1/drugs/check-interaction            Check tương tác
POST   /api/v1/drugs/check-allergy                Check dị ứng
POST   /api/v1/drugs/validate-dose                Validate liều
GET    /api/v1/prescriptions                      Danh sách đơn thuốc
GET    /api/v1/prescriptions/{id}                 Chi tiết đơn
POST   /api/v1/prescriptions                      Kê đơn mới
PUT    /api/v1/prescriptions/{id}/verify           Dược sĩ verify
PUT    /api/v1/prescriptions/{id}/dispense         Xuất thuốc
PUT    /api/v1/prescriptions/{id}/cancel           Hủy đơn
GET    /api/v1/prescriptions/{patientId}/active    Đơn đang dùng
GET    /api/v1/prescriptions/{patientId}/adherence Tuân thủ điều trị
POST   /api/v1/prescriptions/{id}/refill           Gia hạn đơn
```

### Notification Service (8086) — 6 endpoints

```
GET    /api/v1/alerts                             Danh sách alerts
GET    /api/v1/alerts/{id}                        Chi tiết
PUT    /api/v1/alerts/{id}/acknowledge             ACK
GET    /api/v1/alerts/rules                        Danh sách rules
POST   /api/v1/alerts/rules                        Tạo rule
PUT    /api/v1/alerts/rules/{id}                   Sửa rule (toggle on/off)
```

### Device Service (8087) — 9 endpoints

```
GET    /api/v1/devices                            Danh sách devices
GET    /api/v1/devices/{id}                       Chi tiết
POST   /api/v1/devices                            Đăng ký device mới
PUT    /api/v1/devices/{id}                       Cập nhật
POST   /api/v1/devices/{id}/assign                Gán cho BN
DELETE /api/v1/devices/{id}/assign                 Bỏ gán
POST   /api/v1/devices/{id}/calibrate             Yêu cầu hiệu chỉnh
GET    /api/v1/devices/{id}/telemetry             Dữ liệu telemetry
GET    /api/v1/devices/statistics                  Thống kê online/offline
```

### AI Service (8088) — 6 endpoints

```
POST   /api/v1/ai/symptom-check                  Phân tích triệu chứng (BERT)
POST   /api/v1/ai/xray-analyze                   Phân tích X-ray (CNN)
POST   /api/v1/ai/ecg-classify                   Phân loại ECG (LSTM)
POST   /api/v1/ai/risk-predict                   Dự đoán nguy cơ (XGBoost)
POST   /api/v1/ai/deterioration-detect            Phát hiện suy giảm
GET    /api/v1/ai/models                          Danh sách models (MLflow)
```

### Analytics Service — 8 endpoints

```
GET    /api/v1/analytics/overview                 KPI tổng quan
GET    /api/v1/analytics/visits/monthly           Lượt khám theo tháng
GET    /api/v1/analytics/diseases/top             Top bệnh
GET    /api/v1/analytics/bed-occupancy            Tỷ lệ giường
GET    /api/v1/analytics/revenue/weekly           Doanh thu tuần
GET    /api/v1/analytics/demographics             Nhân khẩu BN
GET    /api/v1/analytics/doctor-performance       Hiệu suất bác sĩ
GET    /api/v1/analytics/export/{type}            Export CSV/Excel
```

### Graph Service (8092) — 8 endpoints

```
GET    /api/v1/graph                              Full graph data
GET    /api/v1/graph/query?cypher=xxx             Execute Cypher query
GET    /api/v1/graph/diseases/{id}/related        Bệnh liên quan
GET    /api/v1/graph/drugs/{id}/interactions       Tương tác thuốc
GET    /api/v1/graph/symptoms/{id}/causes          Nguyên nhân triệu chứng
GET    /api/v1/graph/path?from=xxx&to=yyy          Shortest path
GET    /api/v1/graph/statistics                    Graph stats
POST   /api/v1/graph/nodes                         Thêm node (admin)
```

### Search Service (8089) — 7 endpoints

```
GET    /api/v1/search?q=xxx&type=all              Tìm kiếm tổng hợp
GET    /api/v1/search/patients?q=xxx              Tìm bệnh nhân
GET    /api/v1/search/drugs?q=xxx                 Tìm thuốc
GET    /api/v1/search/icd10?q=xxx                 Tìm mã ICD-10
GET    /api/v1/search/ehr?q=xxx                   Tìm trong EHR
GET    /api/v1/search/suggest?q=xxx               Autocomplete
POST   /api/v1/search/advanced                    Tìm kiếm nâng cao
```

### Storage Service (8090) — 7 endpoints

```
GET    /api/v1/storage/files                      Danh sách files
GET    /api/v1/storage/files/{id}                 Chi tiết file
POST   /api/v1/storage/upload                     Upload file
DELETE /api/v1/storage/files/{id}                 Xóa file
GET    /api/v1/storage/files/{id}/download        Pre-signed download URL
GET    /api/v1/storage/buckets                    Danh sách buckets
GET    /api/v1/storage/statistics                 Thống kê dung lượng
```

### GIS Service (8091) — 6 endpoints

```
GET    /api/v1/gis/hospitals                      Danh sách bệnh viện + tọa độ
GET    /api/v1/gis/hospitals/{id}                 Chi tiết
GET    /api/v1/gis/heatmap?disease=xxx            Heatmap dịch tễ
GET    /api/v1/gis/choropleth?metric=xxx          Choropleth theo quận/huyện
GET    /api/v1/gis/outbreak-zones                 Vùng dịch
GET    /api/v1/gis/nearest?lat=xxx&lng=yyy        Bệnh viện gần nhất
```
