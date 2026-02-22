# Mock Data — Frontend Seed Data

---

## Tổng quan

Frontend chạy hoàn toàn với mock data, không cần backend. Tất cả data nằm trong:

```
src/app/core/mock-data/index.ts       ← Data chính (18 datasets)
src/app/core/mock-data/analytics.data.ts  ← 9 datasets cho 8 biểu đồ
```

---

## Datasets

### 10 Bệnh nhân (MOCK_PATIENTS)

| ID | Tên | Tuổi | Giới | Trạng thái | Risk | Phòng |
|----|-----|------|------|-----------|------|-------|
| P-001 | Nguyễn Văn An | 65 | Nam | Nội trú | Critical | ICU-01 |
| P-002 | Trần Thị Bình | 45 | Nữ | Ngoại trú | Medium | Nội 2 |
| P-003 | Lê Hoàng Châu | 72 | Nam | Khẩn cấp | High | Cấp cứu |
| P-004 | Phạm Thị Dung | 38 | Nữ | Ngoại trú | Low | Ngoại |
| P-005 | Hoàng Minh Đức | 55 | Nam | Nội trú | High | Tim mạch |
| P-006 | Ngô Thị Em | 28 | Nữ | Ra viện | Low | Sản |
| P-007 | Vũ Đình Phong | 50 | Nam | Nội trú | Medium | Hô hấp |
| P-008 | Đặng Thị Giang | 61 | Nữ | Khẩn cấp | Critical | ICU-02 |
| P-009 | Bùi Văn Hải | 42 | Nam | Ngoại trú | Low | Ngoại |
| P-010 | Mai Thị Inh | 35 | Nữ | Ngoại trú | Low | Da liễu |

Mỗi BN có: allergies (0-3), insurance ID, blood type, risk score %.

---

### 6 Tài khoản demo (MOCK_USERS)

| Username | Password | Role | Department |
|----------|----------|------|------------|
| admin | admin123 | ADMIN | IT |
| doctor | doctor123 | DOCTOR | Tim mạch |
| nurse | nurse123 | NURSE | Hồi sức |
| pharmacist | pharma123 | PHARMACIST | Dược |
| patient | patient123 | PATIENT | — |
| analyst | analyst123 | DATA_ANALYST | Phân tích |

Thêm 2 bác sĩ phụ: Bs. Minh Hùng (Nội), Bs. Lan Hương (Sản phụ khoa).

---

### 8 Thuốc (MOCK_DRUGS)

| ID | Tên | ATC | Dạng | Hàm lượng |
|----|-----|-----|------|-----------|
| DRUG-001 | Amoxicillin | J01CA04 | Viên nang | 500mg |
| DRUG-002 | Metformin | A10BA02 | Viên nén | 850mg |
| DRUG-003 | Amlodipine | C08CA01 | Viên nén | 5mg |
| DRUG-004 | Omeprazole | A02BC01 | Viên nang | 20mg |
| DRUG-005 | Warfarin | B01AA03 | Viên nén | 5mg |
| DRUG-006 | Aspirin | B01AC06 | Viên nén | 100mg |
| DRUG-007 | Atorvastatin | C10AA05 | Viên nén | 20mg |
| DRUG-008 | Insulin Glargine | A10AE04 | Tiêm | 100IU/mL |

### 3 Tương tác thuốc (MOCK_DRUG_INTERACTIONS)

| Drug 1 | Drug 2 | Mức độ | Cơ chế |
|--------|--------|--------|--------|
| Warfarin | Aspirin | MAJOR | Tăng nguy cơ xuất huyết |
| Metformin | Insulin | MODERATE | Hạ đường huyết quá mức |
| Omeprazole | Metformin | MINOR | Giảm hấp thu B12 |

---

### 8+ Lịch hẹn (MOCK_APPOINTMENTS)

Mỗi appointment có: doctorName, specialty, date, timeSlot, status (6 trạng thái), queueNumber, priority.

Trạng thái: Đã đặt → Đã check-in → Chờ khám → Đang khám → Đã hoàn thành / Đã hủy.

---

### 5 Cảnh báo (MOCK_ALERTS)

| Level | Type | Message |
|-------|------|---------|
| CRITICAL | Vital | SpO2 bệnh nhân P-001 xuống 88% |
| HIGH | Vital | Nhịp tim P-003 tăng 142 bpm |
| MEDIUM | Drug | Tương tác thuốc Warfarin-Aspirin phát hiện |
| MEDIUM | System | Thiết bị IOT-003 mất kết nối |
| LOW | System | Backup database hoàn tất |

---

### 8 Thiết bị IoT (MOCK_DEVICES)

| ID | Loại | Model | Phòng | Pin | Chất lượng |
|----|------|-------|-------|-----|-----------|
| IOT-001 | Pulse Oximeter | Masimo Rad-97 | ICU-01 | 85% | 98% |
| IOT-002 | ECG Monitor | Philips MX800 | ICU-01 | 100% | 95% |
| IOT-003 | Blood Pressure | Omron HBP-1320 | Nội 2 | 12% | 72% |
| IOT-004 | Temperature | Welch Allyn | Cấp cứu | 67% | 91% |
| IOT-005 | Ventilator | Dräger V500 | ICU-02 | 100% | 99% |
| IOT-006 | Glucose Monitor | Dexcom G7 | Nội 1 | 45% | 88% |
| IOT-007 | Infusion Pump | BD Alaris | ICU-01 | 78% | 94% |
| IOT-008 | Wearable Band | Fitbit Sense | Ngoại | 55% | 82% |

---

### 6 File lưu trữ (MOCK_STORAGE_FILES)

X-ray images, CT scans, lab reports, prescriptions PDF — mỗi file có: fileName, mimeType, sizeBytes, bucket, patientId.

---

### 5 Bệnh viện GIS (MOCK_HOSPITALS)

| ID | Tên | Lat | Lng | Loại |
|----|-----|-----|-----|------|
| HN-001 | BV Bạch Mai | 21.0000 | 105.8400 | Trung ương |
| HN-002 | BV Việt Đức | 21.0100 | 105.8500 | Trung ương |
| HN-003 | BV Nhi TW | 21.0200 | 105.8350 | Chuyên khoa |
| DN-001 | BV Đà Nẵng | 16.0678 | 108.2208 | Tỉnh |
| HCM-001 | BV Chợ Rẫy | 10.7570 | 106.6600 | Trung ương |

---

### 9 Datasets Analytics (analytics.data.ts)

| Dataset | Biểu đồ | Loại |
|---------|---------|------|
| monthlyVisits | Lượt khám theo tháng | Bar |
| topDiseases | Top 5 bệnh | Horizontal bar |
| bedOccupancy | Giường bệnh 3 tháng | Stacked bar |
| weeklyRevenue | Doanh thu 4 tuần | Line |
| demographics | Phân bố tuổi-giới | Doughnut |
| alertLevels | Mức cảnh báo | Pie |
| deviceStatus | Trạng thái IoT | Polar area |
| doctorPerformance | Hiệu suất bác sĩ | Radar |
| kpiStats | 4 KPI cards | Numbers |

---

## Khớp Backend

Mỗi mock object có cùng field names với Java DTO. Khi chuyển production, chỉ cần thay `of(MOCK_DATA)` bằng `this.http.get<T>()` — data format không đổi.
