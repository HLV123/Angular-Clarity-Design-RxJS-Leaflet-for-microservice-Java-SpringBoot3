# Coding Conventions — Java · Angular · Python · Git

---

## Java (Spring Boot)

### Naming

| Element | Convention | Ví dụ |
|---------|-----------|-------|
| Class | PascalCase | PatientService, DrugDTO |
| Method | camelCase | getPatientById, checkInteraction |
| Variable | camelCase | patientName, riskScore |
| Constant | UPPER_SNAKE | MAX_RETRY_COUNT, DEFAULT_PAGE_SIZE |
| Package | lowercase | vn.shms.patient.controller |
| Table | snake_case | clinical_notes, prescription_items |
| Column | snake_case | patient_id, created_at |
| REST path | kebab-case | /api/v1/drug-interactions |

### Package Structure (mỗi service)

```
vn.shms.{service}/
├── {Service}Application.java
├── controller/       ← @RestController, request validation
├── dto/              ← Request/Response objects, no JPA annotations
├── entity/           ← @Entity, JPA mappings
├── repository/       ← @Repository, JPA queries
├── service/          ← Interface + Impl, business logic
├── mapper/           ← MapStruct mappers Entity ↔ DTO
├── kafka/            ← Producers & Consumers
├── grpc/             ← gRPC stubs & clients
├── exception/        ← Custom exceptions
├── config/           ← @Configuration beans
└── resources/
    ├── application.yml
    └── db/migration/  ← Flyway SQL scripts
```

### Rules

- DTO không bao giờ chứa JPA annotations
- Entity không bao giờ lộ ra controller (luôn qua DTO)
- Service layer: Interface + Impl pattern
- Exception: extends BusinessException → GlobalExceptionHandler trả ApiResponse
- Flyway migration: V{number}__{description}.sql, không bao giờ sửa file đã chạy
- Logging: SLF4J, không System.out.println
- Test: tên method = `should_expectedBehavior_when_condition()`

---

## Angular (TypeScript)

### Naming

| Element | Convention | Ví dụ |
|---------|-----------|-------|
| Component | kebab-case file, PascalCase class | patients.component.ts, PatientsComponent |
| Service | camelCase method | api.service.ts, getPatients() |
| Interface | PascalCase | Patient, VitalSign, DrugInteraction |
| Signal | camelCase | searchTerm, filteredDevices |
| Route | kebab-case | /ai-diagnosis, /knowledge-graph |
| SCSS class | kebab-case | .card-header, .stat-value, .badge-critical |
| Mock data | UPPER_SNAKE | MOCK_PATIENTS, MOCK_DRUGS |
| Enum/Type | PascalCase values | 'ADMIN' \| 'DOCTOR' \| 'NURSE' |

### File Structure

```
src/app/pages/{module}/
├── {module}.component.ts       ← Logic, signals, API calls
├── {module}.component.html     ← Template, @for/@if control flow
└── {module}.component.scss     ← Import styles-shared + custom
```

### Rules

- Standalone components only (no NgModules)
- Signals over BehaviorSubject (Angular 17+)
- Lazy loading: mỗi page route = 1 lazy chunk
- Không dùng `any` — luôn type đúng interface từ models/
- Template: dùng `@for/@if` new control flow, không `*ngFor/*ngIf`
- SCSS: import styles-shared.scss, tránh inline styles
- Mock data: delay(200-300) simulate network latency

---

## Python (ML Service)

### Naming

| Element | Convention | Ví dụ |
|---------|-----------|-------|
| File | snake_case | symptom_checker.py, ray_deployment.py |
| Class | PascalCase | SymptomChecker, XRayAnalyzer |
| Function | snake_case | check_symptoms, predict_risk |
| Variable | snake_case | model_version, risk_score |
| Constant | UPPER_SNAKE | MAX_PREDICTIONS, DEFAULT_THRESHOLD |
| Proto | snake_case fields | patient_id, icd10_code |

### Rules

- Python 3.11, type hints bắt buộc
- gRPC server: servicer pattern theo protobuf generated code
- Model loading: lazy load from MLflow Registry
- Ray Serve: `@serve.deployment` decorator
- Tests: pytest, mock external dependencies
- Requirements: pin exact versions trong requirements.txt

---

## Git

### Branch Strategy

```
main                 ← Production, protected
├── develop          ← Integration branch
│   ├── feature/SHMS-001-patient-crud
│   ├── feature/SHMS-002-vital-stream
│   ├── feature/SHMS-003-ai-diagnosis
│   └── feature/SHMS-004-drug-interaction
├── release/v1.0
├── hotfix/SHMS-099-critical-alert-fix
```

### Commit Message

```
<type>(<scope>): <description>

feat(patient): add QR check-in endpoint
fix(alert): WebSocket disconnect on timeout
refactor(ehr): extract SOAP note validation
docs(api): update prescription endpoints
test(drug): add interaction check unit tests
chore(deps): bump Spring Boot to 3.2.1
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`

### PR Checklist

```
□ Code compiles (mvn clean package / ng build)
□ Unit tests pass (mvn test / ng test)
□ No new warnings
□ DTO changes reflected in both Java + TypeScript
□ Kafka topic changes documented in kafka-events.md
□ API changes documented in api-contracts.md
□ Database migration added (if schema change)
□ Reviewed by at least 1 team member
```
