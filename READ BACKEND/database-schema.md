# Database Schema — PostgreSQL + Neo4j

---

## PostgreSQL Tables (per service)

### patient-service

```sql
CREATE TABLE patients (
    id              VARCHAR(20)  PRIMARY KEY,        -- P-001
    full_name       VARCHAR(100) NOT NULL,
    date_of_birth   DATE         NOT NULL,
    gender          VARCHAR(10)  NOT NULL,
    phone           VARCHAR(20),
    email           VARCHAR(100),
    address         TEXT,
    blood_type      VARCHAR(5),
    insurance_id    VARCHAR(30),
    status          VARCHAR(20)  DEFAULT 'Ngoại trú', -- Nội trú|Ngoại trú|Khẩn cấp|Ra viện
    risk_level      VARCHAR(10)  DEFAULT 'Low',        -- Critical|High|Medium|Low
    risk_score      FLOAT        DEFAULT 0,
    ward            VARCHAR(50),
    bed_number      VARCHAR(10),
    hospital_id     VARCHAR(20)  NOT NULL,
    created_at      TIMESTAMP    DEFAULT NOW(),
    updated_at      TIMESTAMP    DEFAULT NOW(),
    deleted_at      TIMESTAMP                          -- soft delete
);

CREATE TABLE patient_allergies (
    id              SERIAL       PRIMARY KEY,
    patient_id      VARCHAR(20)  REFERENCES patients(id),
    allergen        VARCHAR(100) NOT NULL,
    severity        VARCHAR(20),                       -- Mild|Moderate|Severe
    reaction        TEXT,
    reported_at     TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE patient_contacts (
    id              SERIAL       PRIMARY KEY,
    patient_id      VARCHAR(20)  REFERENCES patients(id),
    contact_name    VARCHAR(100) NOT NULL,
    relationship    VARCHAR(50),
    phone           VARCHAR(20)  NOT NULL
);

CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_ward ON patients(ward);
CREATE INDEX idx_patients_risk ON patients(risk_level);
CREATE INDEX idx_patients_hospital ON patients(hospital_id);
```

### ehr-service

```sql
CREATE TABLE clinical_notes (
    id              VARCHAR(20)  PRIMARY KEY,        -- CN-001
    patient_id      VARCHAR(20)  NOT NULL,
    doctor_id       VARCHAR(20)  NOT NULL,
    doctor_name     VARCHAR(100),
    type            VARCHAR(30)  DEFAULT 'SOAP',
    subjective      TEXT,
    objective       TEXT,
    assessment      TEXT,
    plan            TEXT,
    status          VARCHAR(20)  DEFAULT 'DRAFT',     -- DRAFT|SIGNED|LOCKED|AMENDED
    version         INT          DEFAULT 1,
    created_at      TIMESTAMP    DEFAULT NOW(),
    updated_at      TIMESTAMP    DEFAULT NOW(),
    locked_at       TIMESTAMP,
    locked_by       VARCHAR(20)
);

CREATE TABLE diagnoses (
    id              VARCHAR(20)  PRIMARY KEY,        -- DX-001
    patient_id      VARCHAR(20)  NOT NULL,
    icd10_code      VARCHAR(10)  NOT NULL,
    description     VARCHAR(200) NOT NULL,
    status          VARCHAR(20)  DEFAULT 'Active',   -- Active|Resolved|Chronic
    diagnosed_by    VARCHAR(20),
    diagnosed_at    TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE lab_results (
    id              VARCHAR(20)  PRIMARY KEY,        -- LAB-001
    patient_id      VARCHAR(20)  NOT NULL,
    test_name       VARCHAR(100) NOT NULL,
    value           VARCHAR(50)  NOT NULL,
    unit            VARCHAR(20),
    reference_range VARCHAR(50),
    status          VARCHAR(20),                     -- Normal|Abnormal|Critical
    ordered_by      VARCHAR(20),
    collected_at    TIMESTAMP,
    resulted_at     TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE medical_images (
    id              VARCHAR(20)  PRIMARY KEY,
    patient_id      VARCHAR(20)  NOT NULL,
    type            VARCHAR(30)  NOT NULL,           -- X-Ray|CT|MRI|Ultrasound
    body_part       VARCHAR(50),
    storage_url     TEXT         NOT NULL,            -- Ceph S3 URL
    findings        TEXT,
    uploaded_by     VARCHAR(20),
    uploaded_at     TIMESTAMP    DEFAULT NOW()
);

CREATE INDEX idx_notes_patient ON clinical_notes(patient_id);
CREATE INDEX idx_diagnoses_patient ON diagnoses(patient_id);
CREATE INDEX idx_labs_patient ON lab_results(patient_id);
```

### appointment-service

```sql
CREATE TABLE appointments (
    id              VARCHAR(20)  PRIMARY KEY,        -- APT-001
    patient_id      VARCHAR(20)  NOT NULL,
    patient_name    VARCHAR(100),
    doctor_id       VARCHAR(20)  NOT NULL,
    doctor_name     VARCHAR(100),
    specialty       VARCHAR(50),
    date            DATE         NOT NULL,
    time_slot       TIME         NOT NULL,
    status          VARCHAR(20)  DEFAULT 'Đã đặt',
    queue_number    INT,
    priority        INT          DEFAULT 5,          -- 1=highest
    notes           TEXT,
    created_at      TIMESTAMP    DEFAULT NOW(),
    updated_at      TIMESTAMP    DEFAULT NOW()
);

CREATE INDEX idx_apt_date ON appointments(date);
CREATE INDEX idx_apt_doctor ON appointments(doctor_id);
CREATE INDEX idx_apt_patient ON appointments(patient_id);
CREATE INDEX idx_apt_status ON appointments(status);
```

### medication-service

```sql
CREATE TABLE drugs (
    id              VARCHAR(20)  PRIMARY KEY,        -- DRUG-001
    generic_name    VARCHAR(100) NOT NULL,
    brand_name      VARCHAR(100),
    atc_code        VARCHAR(10),
    dosage_form     VARCHAR(50),
    strength        VARCHAR(50),
    unit            VARCHAR(20),
    manufacturer    VARCHAR(100),
    stock_quantity  INT          DEFAULT 0,
    reorder_level   INT          DEFAULT 100,
    price           DECIMAL(10,2),
    status          VARCHAR(20)  DEFAULT 'ACTIVE'
);

CREATE TABLE prescriptions (
    id              VARCHAR(20)  PRIMARY KEY,        -- RX-001
    patient_id      VARCHAR(20)  NOT NULL,
    doctor_id       VARCHAR(20)  NOT NULL,
    doctor_name     VARCHAR(100),
    status          VARCHAR(20)  DEFAULT 'PENDING',  -- PENDING|VERIFIED|DISPENSED|CANCELLED
    verified_by     VARCHAR(20),
    dispensed_by    VARCHAR(20),
    notes           TEXT,
    created_at      TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE prescription_items (
    id              SERIAL       PRIMARY KEY,
    prescription_id VARCHAR(20)  REFERENCES prescriptions(id),
    drug_id         VARCHAR(20)  REFERENCES drugs(id),
    drug_name       VARCHAR(100),
    dosage          VARCHAR(100),
    frequency       VARCHAR(50),
    duration        VARCHAR(50),
    quantity        INT
);
```

### user-service

```sql
CREATE TABLE users (
    id              VARCHAR(20)  PRIMARY KEY,        -- user-001
    username        VARCHAR(50)  UNIQUE NOT NULL,
    password_hash   VARCHAR(200) NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(100),
    phone           VARCHAR(20),
    department      VARCHAR(50),
    ward            VARCHAR(50),
    hospital_id     VARCHAR(20),
    status          VARCHAR(20)  DEFAULT 'ACTIVE',   -- ACTIVE|INACTIVE|LOCKED
    mfa_enabled     BOOLEAN      DEFAULT FALSE,
    last_login      TIMESTAMP,
    created_at      TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE user_roles (
    user_id         VARCHAR(20)  REFERENCES users(id),
    role            VARCHAR(20)  NOT NULL,            -- ADMIN|DOCTOR|NURSE|PHARMACIST|PATIENT|DATA_ANALYST
    PRIMARY KEY (user_id, role)
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
```

### notification-service

```sql
CREATE TABLE alerts (
    id              VARCHAR(30)  PRIMARY KEY,
    patient_id      VARCHAR(20),
    device_id       VARCHAR(20),
    type            VARCHAR(30)  NOT NULL,
    level           VARCHAR(10)  NOT NULL,            -- CRITICAL|HIGH|MEDIUM|LOW
    status          VARCHAR(20)  DEFAULT 'UNACKNOWLEDGED',
    message         TEXT         NOT NULL,
    ward            VARCHAR(50),
    acknowledged_by VARCHAR(20),
    acknowledged_at TIMESTAMP,
    created_at      TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE alert_rules (
    id              SERIAL       PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    metric          VARCHAR(30)  NOT NULL,
    operator        VARCHAR(5)   NOT NULL,            -- >, <, >=, <=, ==
    threshold       FLOAT        NOT NULL,
    level           VARCHAR(10)  NOT NULL,
    enabled         BOOLEAN      DEFAULT TRUE,
    created_at      TIMESTAMP    DEFAULT NOW()
);
```

### device-service

```sql
CREATE TABLE iot_devices (
    id              VARCHAR(20)  PRIMARY KEY,        -- IOT-001
    type            VARCHAR(30)  NOT NULL,
    model           VARCHAR(100),
    firmware_version VARCHAR(20),
    status          VARCHAR(10)  DEFAULT 'OFFLINE',  -- ONLINE|OFFLINE|WARNING|ERROR
    battery_level   INT          DEFAULT 100,
    data_quality    INT          DEFAULT 100,
    ward            VARCHAR(50),
    assigned_patient_id   VARCHAR(20),
    assigned_patient_name VARCHAR(100),
    last_sync_at    TIMESTAMP,
    registered_at   TIMESTAMP    DEFAULT NOW()
);

CREATE INDEX idx_devices_status ON iot_devices(status);
CREATE INDEX idx_devices_patient ON iot_devices(assigned_patient_id);
```

### storage-service

```sql
CREATE TABLE storage_files (
    id              VARCHAR(20)  PRIMARY KEY,
    file_name       VARCHAR(200) NOT NULL,
    mime_type       VARCHAR(50),
    size_bytes      BIGINT,
    bucket          VARCHAR(50)  NOT NULL,
    object_key      TEXT         NOT NULL,
    patient_id      VARCHAR(20),
    uploaded_by     VARCHAR(20),
    category        VARCHAR(30),                     -- XRAY|CT|MRI|LAB_REPORT|PRESCRIPTION|OTHER
    created_at      TIMESTAMP    DEFAULT NOW()
);
```

---

## Neo4j Schema (graph-service)

### Node Types & Constraints

```cypher
CREATE CONSTRAINT disease_id IF NOT EXISTS FOR (d:Disease) REQUIRE d.id IS UNIQUE;
CREATE CONSTRAINT drug_id IF NOT EXISTS FOR (d:Drug) REQUIRE d.id IS UNIQUE;
CREATE CONSTRAINT symptom_id IF NOT EXISTS FOR (s:Symptom) REQUIRE s.id IS UNIQUE;
CREATE CONSTRAINT patient_id IF NOT EXISTS FOR (p:Patient) REQUIRE p.id IS UNIQUE;

CREATE INDEX disease_name IF NOT EXISTS FOR (d:Disease) ON (d.name);
CREATE INDEX drug_name IF NOT EXISTS FOR (d:Drug) ON (d.name);
CREATE INDEX symptom_name IF NOT EXISTS FOR (s:Symptom) ON (s.name);
```

### Relationship Types

```cypher
(:Drug)-[:INTERACTS_WITH {severity, mechanism, recommendation}]->(:Drug)
(:Drug)-[:TREATS {efficacy, evidence_level}]->(:Disease)
(:Drug)-[:CAUSES_SIDE_EFFECT {frequency, severity}]->(:Symptom)
(:Disease)-[:HAS_SYMPTOM {frequency, specificity}]->(:Symptom)
(:Disease)-[:COMORBID_WITH {prevalence}]->(:Disease)
(:Patient)-[:DIAGNOSED_WITH {date, status}]->(:Disease)
(:Patient)-[:PRESCRIBED {date, dosage}]->(:Drug)
(:Patient)-[:ALLERGIC_TO {severity, reaction}]->(:Drug)
```

### Naming Conventions

| Element | Convention | Ví dụ |
|---------|-----------|-------|
| Node label | PascalCase | Disease, Drug, Symptom |
| Property | camelCase | genericName, icd10Code |
| Relationship type | UPPER_SNAKE_CASE | INTERACTS_WITH, TREATS |
| Relationship property | camelCase | severity, mechanism |
| Node ID | prefix-number | DIS-001, DRUG-001, SYM-001 |
