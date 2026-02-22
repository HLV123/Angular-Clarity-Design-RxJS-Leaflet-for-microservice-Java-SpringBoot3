# Kiến trúc hệ thống SHMS v1.0

---

## Tổng quan

14 module nghiệp vụ, 17 microservices, 8 giao thức, triển khai Docker/Kubernetes.

---

## Sơ đồ giao tiếp

```
                          ┌──────────────────┐
                          │   Angular 17 SPA │
                          │   (port 4200)    │
                          └────────┬─────────┘
                       HTTP/REST   │   WebSocket/STOMP
                                   ▼
                          ┌──────────────────┐
                          │  Spring Cloud    │
                          │  Gateway (8080)  │
                          │  JWT · CORS ·    │
                          │  Rate Limit      │
                          └────────┬─────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                     │
    ┌─────────▼───────┐  ┌────────▼────────┐  ┌────────▼────────┐
    │ patient-service  │  │ ehr-service     │  │ user-service    │
    │ (8081)           │  │ (8082)          │  │ (8083)          │
    │ PostgreSQL       │  │ PostgreSQL      │  │ PostgreSQL+JWT  │
    └─────────────────┘  └─────────────────┘  └─────────────────┘
    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
    │ appointment-svc  │  │ medication-svc  │  │ notification-svc│
    │ (8084)           │  │ (8085)          │  │ (8086)          │
    │ Queue WebSocket  │  │ Neo4j drug chk  │  │ Kafka → WS push│
    └─────────────────┘  └─────────────────┘  └─────────────────┘
    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
    │ device-service   │  │ ai-gateway-svc  │  │ search-service  │
    │ (8087) MQTT      │  │ (8088) gRPC→Py  │  │ (8089) ES      │
    └─────────────────┘  └────────┬────────┘  └─────────────────┘
                                  │gRPC
                         ┌────────▼────────┐
    ┌─────────────────┐  │ ml-service      │  ┌─────────────────┐
    │ storage-service  │  │ Python 3.11    │  │ graph-service   │
    │ (8090) Ceph S3   │  │ Ray Serve      │  │ (8092) Neo4j    │
    └─────────────────┘  │ TF+XGB+MLflow  │  └─────────────────┘
                         └─────────────────┘
    ┌─────────────────┐  ┌─────────────────┐
    │ gis-service      │  │ vital-stream    │
    │ (8091) PostGIS   │  │ (Flink job)    │
    └─────────────────┘  │ anomaly detect  │
                         └─────────────────┘

    Infrastructure: Eureka (8761) · Config Server (8888)
    Data stores:    PostgreSQL 16 · Redis 7 · Neo4j 5 · Elasticsearch 8.12 · Ceph S3
    Streaming:      Kafka 3.7 · Apache Flink
```

---

## 17 Microservices

| # | Service | Port | Database | Giao thức |
|---|---------|------|----------|-----------|
| 1 | api-gateway | 8080 | — | REST proxy, WebSocket proxy, JWT filter |
| 2 | service-registry | 8761 | — | Eureka service discovery |
| 3 | config-server | 8888 | Git | Centralized config |
| 4 | patient-service | 8081 | PostgreSQL | REST, Kafka producer |
| 5 | ehr-service | 8082 | PostgreSQL | REST, Kafka, gRPC client |
| 6 | user-service | 8083 | PostgreSQL + Redis | REST, JWT issuer, OTP |
| 7 | appointment-service | 8084 | PostgreSQL | REST, WebSocket STOMP, Kafka |
| 8 | medication-service | 8085 | PostgreSQL + Neo4j | REST, Neo4j Bolt, gRPC |
| 9 | notification-service | 8086 | PostgreSQL + Redis | Kafka consumer, WebSocket push, SMS/Email |
| 10 | device-service | 8087 | PostgreSQL | REST, MQTT subscriber, Kafka producer |
| 11 | ai-gateway-service | 8088 | — | REST → gRPC bridge to ml-service |
| 12 | search-service | 8089 | Elasticsearch | REST, Kafka consumer (index sync) |
| 13 | storage-service | 8090 | PostgreSQL + Ceph S3 | REST, pre-signed URL |
| 14 | gis-service | 8091 | PostgreSQL + PostGIS | REST |
| 15 | graph-service | 8092 | Neo4j | REST, Neo4j Bolt |
| 16 | vital-stream-processor | — | — | Kafka consumer/producer, Flink job |
| 17 | ml-service | 50051 | MLflow | gRPC server, Ray Serve, TensorFlow |

---

## 8 Giao thức

| Giao thức | Công nghệ | Nghiệp vụ |
|-----------|-----------|-----------|
| REST | Spring Boot | CRUD bệnh nhân, lịch hẹn, đơn thuốc, hồ sơ, phân quyền |
| WebSocket STOMP | Spring WebSocket | Realtime sinh hiệu, cảnh báo, hàng đợi, dashboard live |
| gRPC | Spring gRPC ↔ Python | ML inference, giao tiếp nội bộ microservice |
| Kafka | Apache Kafka 3.7 | IoT pipeline, audit log, notification, anomaly stream |
| Neo4j Bolt | Neo4j 5 Java Driver | Knowledge graph, drug interactions |
| Elasticsearch REST | Spring Data ES | Full-text search patients/drugs/ICD-10 |
| Redis RESP | Spring Data Redis | Cache, session, rate limit, OTP |
| S3 API | AWS SDK → Ceph | Lưu trữ X-ray, DICOM, PDF |

---

## Quyết định thiết kế

**Tại sao microservices thay vì monolith?**
- Module y tế có lifecycle khác nhau (AI model update độc lập, EHR cần audit riêng)
- Scale riêng: vital-stream cần scale khi nhiều IoT, AI inference cần GPU riêng
- Team phát triển song song: Java team + Python ML team + Frontend team

**Tại sao Kafka thay vì RabbitMQ?**
- IoT data throughput cao (hàng nghìn msg/s từ bedside monitors)
- Cần replay events cho Flink stream processing
- Kafka Streams/Flink cho real-time anomaly detection

**Tại sao Neo4j cho drug interactions?**
- Quan hệ thuốc-bệnh-triệu chứng là graph tự nhiên
- Cypher query cho pathfinding (drug A → interacts → drug B qua enzyme C)
- Pattern matching nhanh hơn SQL JOIN nhiều bảng

**Tại sao gRPC cho AI thay vì REST?**
- Binary protobuf nhỏ hơn JSON cho medical image transfer
- Streaming cho ECG realtime classification
- Strong typing với proto definitions

**Tại sao Ceph thay vì local storage?**
- Medical files (DICOM) lớn, cần distributed storage
- S3-compatible API, dễ migrate sang AWS/GCP sau
- Redundancy cho dữ liệu y tế quan trọng

---

## Luồng dữ liệu IoT → Dashboard

```
IoT Device (Wearable/Monitor)
    │ MQTT
    ▼
device-service (8087)
    │ Kafka produce → [vital.raw]
    ▼
Apache Flink (vital-stream-processor)
    ├── Aggregate (sliding window 60 điểm)
    ├── Anomaly detection (threshold + ML score)
    ├── Kafka produce → [vital.processed]
    └── If anomaly → Kafka produce → [vital.alert]
                                          │
    ┌─────────────────────────────────────┘
    ▼
notification-service (8086)
    ├── Lưu Redis (unacknowledged alerts)
    ├── WebSocket STOMP push → Angular Dashboard
    ├── SMS → y tá trực (if CRITICAL)
    └── Email → bác sĩ phụ trách (if HIGH)
```

---

## Luồng AI Inference

```
Angular (bác sĩ nhập triệu chứng)
    │ POST /api/v1/ai/symptom-check
    ▼
api-gateway (8080) → JWT verify
    │
    ▼
ai-gateway-service (8088, Java)
    │ gRPC call
    ▼
ml-service (50051, Python/Ray Serve)
    ├── Load model từ MLflow Registry
    ├── BERT model → top-5 ICD-10 predictions
    ├── Confidence scores + rationale
    └── gRPC response
    │
    ▼
ai-gateway-service → REST response
    │
    ▼
Angular UI (hiển thị suggestions + triage level)
```
