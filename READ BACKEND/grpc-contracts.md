# gRPC Contracts — 4 Services, 10 RPC Methods

---

## Overview

gRPC dùng cho giao tiếp nội bộ giữa microservices, không đi qua Gateway.

```
ai-gateway (Java) ──gRPC:50051──▶ ml-service (Python)
ehr-service (Java) ──gRPC:50052──▶ patient-service (Java)
ehr-service (Java) ──gRPC:50053──▶ medication-service (Java)
multiple services  ──gRPC:50054──▶ notification-service (Java)
```

---

## 1. DiagnosisService (ml-service, port 50051)

```protobuf
syntax = "proto3";
package shms.ai;

service DiagnosisService {
  rpc CheckSymptoms (SymptomRequest) returns (DiagnosisResponse);
  rpc AnalyzeXRay (XRayRequest) returns (XRayResponse);
  rpc ClassifyECG (ECGRequest) returns (ECGResponse);
  rpc PredictRisk (RiskRequest) returns (RiskResponse);
}

message SymptomRequest {
  string patient_id = 1;
  string symptoms_text = 2;
  repeated string existing_conditions = 3;
  int32 age = 4;
  string gender = 5;
}

message DiagnosisSuggestion {
  string icd10_code = 1;
  string disease_name = 2;
  float probability = 3;
  string rationale = 4;
}

message DiagnosisResponse {
  repeated DiagnosisSuggestion suggestions = 1;
  float confidence = 2;
  string recommendation = 3;
  string triage_level = 4;
  string model_version = 5;
}

message XRayRequest {
  string patient_id = 1;
  bytes image_data = 2;
  string image_format = 3;
  string body_part = 4;
}

message XRayResponse {
  repeated Finding findings = 1;
  float overall_confidence = 2;
  string model_version = 3;
}

message Finding {
  string description = 1;
  float confidence = 2;
  BoundingBox location = 3;
}

message BoundingBox {
  float x = 1;
  float y = 2;
  float width = 3;
  float height = 4;
}

message ECGRequest {
  string patient_id = 1;
  repeated float signal_data = 2;
  int32 sampling_rate = 3;
  int32 duration_seconds = 4;
}

message ECGResponse {
  string rhythm = 1;
  int32 heart_rate = 2;
  repeated string abnormalities = 3;
  float qtc_interval = 4;
  float confidence = 5;
  string model_version = 6;
}

message RiskRequest {
  string patient_id = 1;
  int32 age = 2;
  string gender = 3;
  repeated string conditions = 4;
  map<string, float> vitals = 5;
  map<string, float> lab_values = 6;
}

message RiskResponse {
  float risk_score = 1;
  repeated RiskFactor factors = 2;
  string risk_level = 3;
  string model_version = 4;
}

message RiskFactor {
  string name = 1;
  float contribution = 2;
}
```

---

## 2. PatientDataService (patient-service, port 50052)

```protobuf
syntax = "proto3";
package shms.patient;

service PatientDataService {
  rpc GetPatientSummary (PatientIdRequest) returns (PatientSummary);
  rpc GetAllergies (PatientIdRequest) returns (AllergyList);
  rpc GetConditions (PatientIdRequest) returns (ConditionList);
}

message PatientIdRequest {
  string patient_id = 1;
}

message PatientSummary {
  string id = 1;
  string full_name = 2;
  int32 age = 3;
  string gender = 4;
  string blood_type = 5;
  string risk_level = 6;
  repeated string allergies = 7;
  repeated string active_conditions = 8;
}

message AllergyList {
  repeated Allergy allergies = 1;
}

message Allergy {
  string allergen = 1;
  string severity = 2;
  string reaction = 3;
}

message ConditionList {
  repeated Condition conditions = 1;
}

message Condition {
  string icd10_code = 1;
  string name = 2;
  string status = 3;
  string onset_date = 4;
}
```

---

## 3. MedicationCheckService (medication-service, port 50053)

```protobuf
syntax = "proto3";
package shms.medication;

service MedicationCheckService {
  rpc CheckInteractions (InteractionRequest) returns (InteractionResponse);
  rpc CheckAllergy (AllergyCheckRequest) returns (AllergyCheckResponse);
  rpc ValidateDose (DoseValidationRequest) returns (DoseValidationResponse);
}

message InteractionRequest {
  repeated string drug_ids = 1;
}

message InteractionResponse {
  repeated Interaction interactions = 1;
  bool safe = 2;
}

message Interaction {
  string drug1 = 1;
  string drug2 = 2;
  string severity = 3;
  string mechanism = 4;
  string recommendation = 5;
}

message AllergyCheckRequest {
  string patient_id = 1;
  string drug_id = 2;
}

message AllergyCheckResponse {
  bool has_allergy = 1;
  string allergen = 2;
  string severity = 3;
  string alternative_drug = 4;
}

message DoseValidationRequest {
  string drug_id = 1;
  float dose_mg = 2;
  string frequency = 3;
  int32 patient_age = 4;
  float patient_weight_kg = 5;
  float gfr = 6;
}

message DoseValidationResponse {
  bool valid = 1;
  string message = 2;
  float recommended_dose_mg = 3;
}
```

---

## Circuit Breaker & Timeout Config

```yaml
grpc:
  client:
    diagnosis-service:
      address: static://ml-service:50051
      deadline: 10s                    # timeout per call
      retry:
        max-attempts: 3
        initial-backoff: 500ms
        max-backoff: 5s
      circuit-breaker:
        failure-rate-threshold: 50     # % failures to open
        wait-duration-in-open-state: 30s
        sliding-window-size: 10

    patient-data-service:
      address: static://patient-service:50052
      deadline: 3s
      retry:
        max-attempts: 2

    medication-check-service:
      address: static://medication-service:50053
      deadline: 5s
      retry:
        max-attempts: 2
```

---

## Fallback Behavior

| Service | Khi circuit open | Fallback |
|---------|-----------------|----------|
| DiagnosisService | ml-service down | Return cached last-known predictions + warning |
| PatientDataService | patient-service down | Return data from Redis cache |
| MedicationCheckService | medication-service down | Block prescription (safety first), show error |
