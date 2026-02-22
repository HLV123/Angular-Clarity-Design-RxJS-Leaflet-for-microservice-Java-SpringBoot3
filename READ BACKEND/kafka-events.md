# Kafka Events — 13 Topics

---

## Topic Registry

| Topic | Producer | Consumer(s) | Partitions | Retention |
|-------|----------|-------------|------------|-----------|
| `vital.raw` | device-service | Flink | 12 | 24h |
| `vital.processed` | Flink | notification-svc, storage-svc | 12 | 7d |
| `vital.alert` | Flink | notification-svc | 6 | 30d |
| `patient.created` | patient-service | search-svc, graph-svc, ehr-svc | 6 | 30d |
| `patient.updated` | patient-service | search-svc, graph-svc | 6 | 30d |
| `appointment.created` | appointment-svc | notification-svc | 6 | 30d |
| `appointment.completed` | appointment-svc | analytics (Flink), ehr-svc | 6 | 30d |
| `prescription.created` | medication-svc | notification-svc, analytics | 6 | 30d |
| `prescription.dispensed` | medication-svc | analytics, ehr-svc | 6 | 30d |
| `ehr.audit` | ehr-service | audit-store (Flink) | 3 | 365d |
| `notification.email` | multiple | email-handler | 3 | 7d |
| `notification.sms` | multiple | sms-handler | 3 | 7d |
| `analytics.daily` | Flink | analytics-store | 1 | 365d |

---

## Payload Schemas

### vital.raw

```json
{
  "deviceId": "IOT-001",
  "patientId": "P-001",
  "timestamp": "2024-10-15T08:30:00Z",
  "metrics": {
    "heartRate": 78,
    "spO2": 97,
    "bloodPressureSystolic": 120,
    "bloodPressureDiastolic": 80,
    "temperature": 36.8,
    "respiratoryRate": 16
  },
  "quality": 95
}
```

### vital.alert

```json
{
  "alertId": "ALT-uuid",
  "patientId": "P-001",
  "deviceId": "IOT-001",
  "level": "CRITICAL",
  "type": "THRESHOLD_BREACH",
  "metric": "spO2",
  "value": 88,
  "threshold": 90,
  "message": "SpO2 xuống 88% — dưới ngưỡng 90%",
  "timestamp": "2024-10-15T08:31:00Z",
  "ward": "ICU-01"
}
```

### patient.created

```json
{
  "eventType": "PATIENT_CREATED",
  "eventId": "evt-uuid",
  "timestamp": "2024-10-15T08:00:00Z",
  "data": {
    "id": "P-011",
    "fullName": "Nguyễn Văn A",
    "dob": "1990-05-15",
    "gender": "Nam",
    "phone": "0901000011",
    "ward": "Nội 2",
    "status": "Ngoại trú",
    "riskLevel": "Low"
  }
}
```

### prescription.created

```json
{
  "eventType": "PRESCRIPTION_CREATED",
  "eventId": "evt-uuid",
  "timestamp": "2024-10-15T09:00:00Z",
  "data": {
    "prescriptionId": "RX-004",
    "patientId": "P-001",
    "doctorId": "user-002",
    "items": [
      {
        "drugId": "DRUG-001",
        "drugName": "Amoxicillin 500mg",
        "dosage": "500mg x 3 lần/ngày",
        "duration": "7 ngày",
        "quantity": 21
      }
    ],
    "notes": "Uống sau ăn"
  }
}
```

### ehr.audit

```json
{
  "eventType": "EHR_MODIFIED",
  "eventId": "evt-uuid",
  "timestamp": "2024-10-15T09:15:00Z",
  "userId": "user-002",
  "userRole": "DOCTOR",
  "patientId": "P-001",
  "action": "UPDATE",
  "resource": "ClinicalNote",
  "resourceId": "CN-001",
  "changes": {
    "assessment": {
      "old": "Nghi viêm phổi",
      "new": "Xác nhận viêm phổi thùy phải"
    }
  }
}
```

---

## Partition Strategy

| Topic | Partition key | Lý do |
|-------|--------------|-------|
| vital.raw | deviceId | Đảm bảo thứ tự dữ liệu theo device |
| vital.alert | patientId | Group alerts cùng BN |
| patient.* | patientId | Đảm bảo thứ tự events theo BN |
| prescription.* | patientId | Đảm bảo thứ tự đơn thuốc theo BN |
| ehr.audit | patientId | Audit trail theo BN |
| notification.* | userId | Không trùng notification |

---

## Dead Letter Queue (DLQ)

Mỗi topic có DLQ tương ứng: `{topic}.dlq`

```
vital.alert.dlq
patient.created.dlq
prescription.created.dlq
...
```

Config:

```yaml
spring.kafka:
  consumer:
    max-poll-records: 500
    auto-offset-reset: earliest
  retry:
    max-attempts: 3
    backoff:
      initial-interval: 1000
      multiplier: 2
      max-interval: 10000
  dlq:
    enabled: true
    topic-suffix: .dlq
```

---

## Consumer Groups

| Group ID | Service | Topics subscribed |
|----------|---------|-------------------|
| notification-group | notification-svc | vital.alert, appointment.created, prescription.created |
| search-indexer | search-svc | patient.created, patient.updated |
| graph-sync | graph-svc | patient.created, patient.updated |
| analytics-agg | Flink | appointment.completed, prescription.dispensed |
| audit-writer | Flink | ehr.audit |
| email-sender | email-handler | notification.email |
| sms-sender | sms-handler | notification.sms |
