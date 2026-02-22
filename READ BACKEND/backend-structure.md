# SHMS Backend — Cấu trúc Microservices

---

```
shms-backend/
├── docker-compose.yml
├── docker-compose.infra.yml
├── kubernetes/
│   ├── namespace.yml
│   ├── configmap.yml
│   ├── secrets.yml
│   ├── gateway-deployment.yml
│   ├── patient-service-deployment.yml
│   ├── ehr-service-deployment.yml
│   ├── user-service-deployment.yml
│   ├── appointment-service-deployment.yml
│   ├── medication-service-deployment.yml
│   ├── notification-service-deployment.yml
│   ├── device-service-deployment.yml
│   ├── ai-gateway-deployment.yml
│   ├── search-service-deployment.yml
│   ├── storage-service-deployment.yml
│   ├── gis-service-deployment.yml
│   ├── graph-service-deployment.yml
│   ├── ml-service-deployment.yml
│   ├── flink-job-deployment.yml
│   ├── kafka-statefulset.yml
│   ├── redis-statefulset.yml
│   ├── elasticsearch-statefulset.yml
│   ├── neo4j-statefulset.yml
│   ├── postgresql-statefulset.yml
│   ├── ceph-statefulset.yml
│   └── ingress.yml
│
├── api-gateway/                              ← Spring Cloud Gateway (port 8080)
│   ├── pom.xml
│   └── src/main/java/vn/shms/gateway/
│       ├── GatewayApplication.java
│       ├── config/
│       │   ├── RouteConfig.java
│       │   ├── CorsConfig.java
│       │   ├── SecurityConfig.java
│       │   └── WebSocketConfig.java
│       ├── filter/
│       │   ├── JwtAuthenticationFilter.java
│       │   ├── RateLimitFilter.java
│       │   └── LoggingFilter.java
│       └── resources/
│           ├── application.yml
│           └── application-prod.yml
│
├── service-registry/                         ← Eureka Server (port 8761)
│   ├── pom.xml
│   └── src/main/java/vn/shms/registry/
│       ├── RegistryApplication.java
│       └── resources/
│           └── application.yml
│
├── config-server/                            ← Spring Cloud Config (port 8888)
│   ├── pom.xml
│   └── src/main/java/vn/shms/config/
│       ├── ConfigServerApplication.java
│       └── resources/
│           ├── application.yml
│           └── configurations/
│               ├── patient-service.yml
│               ├── ehr-service.yml
│               ├── user-service.yml
│               ├── appointment-service.yml
│               ├── medication-service.yml
│               ├── notification-service.yml
│               ├── device-service.yml
│               ├── ai-gateway-service.yml
│               ├── search-service.yml
│               ├── storage-service.yml
│               ├── gis-service.yml
│               └── graph-service.yml
│
├── patient-service/                          ← Port 8081
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/vn/shms/patient/
│       ├── PatientServiceApplication.java
│       ├── controller/
│       │   └── PatientController.java
│       ├── dto/
│       │   ├── PatientDTO.java
│       │   ├── CreatePatientRequest.java
│       │   └── PatientSearchRequest.java
│       ├── entity/
│       │   ├── Patient.java
│       │   └── PatientContact.java
│       ├── repository/
│       │   └── PatientRepository.java
│       ├── service/
│       │   ├── PatientService.java
│       │   └── PatientServiceImpl.java
│       ├── mapper/
│       │   └── PatientMapper.java
│       ├── kafka/
│       │   └── PatientEventProducer.java
│       ├── exception/
│       │   ├── PatientNotFoundException.java
│       │   └── GlobalExceptionHandler.java
│       └── resources/
│           ├── application.yml
│           └── db/migration/
│               ├── V1__create_patient_table.sql
│               └── V2__add_risk_score.sql
│
├── ehr-service/                              ← Port 8082
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/vn/shms/ehr/
│       ├── EhrServiceApplication.java
│       ├── controller/
│       │   ├── ClinicalNoteController.java
│       │   ├── DiagnosisController.java
│       │   └── LabResultController.java
│       ├── dto/
│       │   ├── ClinicalNoteDTO.java
│       │   ├── DiagnosisDTO.java
│       │   ├── LabResultDTO.java
│       │   └── MedicalImageDTO.java
│       ├── entity/
│       │   ├── ClinicalNote.java
│       │   ├── Diagnosis.java
│       │   ├── LabResult.java
│       │   └── MedicalImage.java
│       ├── repository/
│       │   ├── ClinicalNoteRepository.java
│       │   ├── DiagnosisRepository.java
│       │   └── LabResultRepository.java
│       ├── service/
│       │   ├── EhrService.java
│       │   └── EhrServiceImpl.java
│       ├── mapper/
│       │   └── EhrMapper.java
│       ├── kafka/
│       │   └── EhrEventProducer.java
│       └── resources/
│           ├── application.yml
│           └── db/migration/
│               ├── V1__create_ehr_tables.sql
│               └── V2__add_audit_trail.sql
│
├── user-service/                             ← Port 8083
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/vn/shms/user/
│       ├── UserServiceApplication.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   └── UserController.java
│       ├── dto/
│       │   ├── UserDTO.java
│       │   ├── AuthRequest.java
│       │   ├── AuthResponse.java
│       │   └── CreateUserRequest.java
│       ├── entity/
│       │   ├── User.java
│       │   └── Role.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   └── RoleRepository.java
│       ├── service/
│       │   ├── UserService.java
│       │   ├── UserServiceImpl.java
│       │   └── JwtService.java
│       ├── security/
│       │   ├── JwtTokenProvider.java
│       │   ├── JwtAuthFilter.java
│       │   └── SecurityConfig.java
│       └── resources/
│           ├── application.yml
│           └── db/migration/
│               ├── V1__create_user_tables.sql
│               └── V2__seed_default_users.sql
│
├── appointment-service/                      ← Port 8084
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/vn/shms/appointment/
│       ├── AppointmentServiceApplication.java
│       ├── controller/
│       │   ├── AppointmentController.java
│       │   └── QueueController.java
│       ├── dto/
│       │   ├── AppointmentDTO.java
│       │   ├── QueueUpdateMessage.java
│       │   └── CreateAppointmentRequest.java
│       ├── entity/
│       │   └── Appointment.java
│       ├── repository/
│       │   └── AppointmentRepository.java
│       ├── service/
│       │   ├── AppointmentService.java
│       │   ├── AppointmentServiceImpl.java
│       │   └── QueueService.java
│       ├── websocket/
│       │   └── QueueWebSocketHandler.java
│       ├── kafka/
│       │   └── AppointmentEventProducer.java
│       └── resources/
│           ├── application.yml
│           └── db/migration/
│               └── V1__create_appointment_table.sql
│
├── medication-service/                       ← Port 8085
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/vn/shms/medication/
│       ├── MedicationServiceApplication.java
│       ├── controller/
│       │   ├── DrugController.java
│       │   ├── PrescriptionController.java
│       │   └── InteractionController.java
│       ├── dto/
│       │   ├── DrugDTO.java
│       │   ├── PrescriptionDTO.java
│       │   └── DrugInteractionDTO.java
│       ├── entity/
│       │   ├── Drug.java
│       │   ├── Prescription.java
│       │   └── PrescriptionItem.java
│       ├── repository/
│       │   ├── DrugRepository.java
│       │   └── PrescriptionRepository.java
│       ├── service/
│       │   ├── DrugService.java
│       │   ├── PrescriptionService.java
│       │   └── InteractionCheckService.java
│       └── resources/
│           ├── application.yml
│           └── db/migration/
│               ├── V1__create_drug_tables.sql
│               └── V2__seed_drug_catalog.sql
│
├── notification-service/                     ← Port 8086
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/vn/shms/notification/
│       ├── NotificationServiceApplication.java
│       ├── controller/
│       │   ├── AlertController.java
│       │   └── AlertRuleController.java
│       ├── dto/
│       │   ├── AlertDTO.java
│       │   └── AlertStreamMessage.java
│       ├── entity/
│       │   ├── Alert.java
│       │   └── AlertRule.java
│       ├── repository/
│       │   ├── AlertRepository.java
│       │   └── AlertRuleRepository.java
│       ├── service/
│       │   ├── AlertService.java
│       │   ├── AlertServiceImpl.java
│       │   └── AlertRuleEngine.java
│       ├── kafka/
│       │   ├── AlertEventConsumer.java
│       │   └── VitalAlertConsumer.java
│       ├── websocket/
│       │   └── AlertWebSocketHandler.java
│       └── resources/
│           ├── application.yml
│           └── db/migration/
│               └── V1__create_alert_tables.sql
│
├── device-service/                           ← Port 8087
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/vn/shms/device/
│       ├── DeviceServiceApplication.java
│       ├── controller/
│       │   └── DeviceController.java
│       ├── dto/
│       │   └── IoTDeviceDTO.java
│       ├── entity/
│       │   └── IoTDevice.java
│       ├── repository/
│       │   └── DeviceRepository.java
│       ├── service/
│       │   ├── DeviceService.java
│       │   └── DeviceServiceImpl.java
│       ├── mqtt/
│       │   └── MqttSubscriber.java
│       ├── kafka/
│       │   └── DeviceEventProducer.java
│       └── resources/
│           ├── application.yml
│           └── db/migration/
│               └── V1__create_device_table.sql
│
├── ai-gateway-service/                       ← Port 8088 (Java → gRPC → Python)
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/vn/shms/ai/
│       ├── AiGatewayApplication.java
│       ├── controller/
│       │   ├── SymptomCheckController.java
│       │   ├── XrayAnalysisController.java
│       │   └── RiskPredictionController.java
│       ├── dto/
│       │   ├── DiagnosisSuggestion.java
│       │   └── DiagnosisResponse.java
│       ├── grpc/
│       │   ├── DiagnosisServiceGrpc.java
│       │   └── DiagnosisServiceClient.java
│       ├── proto/
│       │   └── diagnosis.proto
│       └── resources/
│           └── application.yml
│
├── search-service/                           ← Port 8089
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/vn/shms/search/
│       ├── SearchServiceApplication.java
│       ├── controller/
│       │   └── SearchController.java
│       ├── dto/
│       │   └── SearchResultDTO.java
│       ├── service/
│       │   └── ElasticsearchService.java
│       ├── index/
│       │   ├── PatientIndex.java
│       │   ├── DrugIndex.java
│       │   └── DiagnosisIndex.java
│       ├── kafka/
│       │   └── IndexEventConsumer.java
│       └── resources/
│           └── application.yml
│
├── storage-service/                          ← Port 8090
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/vn/shms/storage/
│       ├── StorageServiceApplication.java
│       ├── controller/
│       │   └── StorageController.java
│       ├── dto/
│       │   └── StorageFileDTO.java
│       ├── entity/
│       │   └── StorageFile.java
│       ├── repository/
│       │   └── StorageFileRepository.java
│       ├── service/
│       │   ├── StorageService.java
│       │   └── CephS3Client.java
│       └── resources/
│           ├── application.yml
│           └── db/migration/
│               └── V1__create_storage_table.sql
│
├── gis-service/                              ← Port 8091
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/vn/shms/gis/
│       ├── GisServiceApplication.java
│       ├── controller/
│       │   └── GisController.java
│       ├── dto/
│       │   ├── HospitalLocationDTO.java
│       │   └── DiseaseHeatmapDTO.java
│       ├── entity/
│       │   └── HospitalLocation.java
│       ├── repository/
│       │   └── HospitalRepository.java
│       ├── service/
│       │   └── GisService.java
│       └── resources/
│           ├── application.yml
│           └── db/migration/
│               └── V1__create_gis_tables.sql
│
├── graph-service/                            ← Port 8092 (Neo4j)
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/vn/shms/graph/
│       ├── GraphServiceApplication.java
│       ├── controller/
│       │   └── GraphController.java
│       ├── dto/
│       │   ├── GraphNodeDTO.java
│       │   └── GraphRelationshipDTO.java
│       ├── entity/
│       │   ├── DiseaseNode.java
│       │   ├── DrugNode.java
│       │   ├── SymptomNode.java
│       │   └── TreatsRelationship.java
│       ├── repository/
│       │   ├── DiseaseRepository.java
│       │   ├── DrugRepository.java
│       │   └── SymptomRepository.java
│       ├── service/
│       │   └── GraphQueryService.java
│       └── resources/
│           └── application.yml
│
├── vital-stream-processor/                   ← Apache Flink job
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/vn/shms/flink/
│       ├── VitalStreamJob.java
│       ├── function/
│       │   ├── AnomalyDetector.java
│       │   ├── VitalAggregator.java
│       │   └── AlertTrigger.java
│       ├── schema/
│       │   ├── VitalSignSchema.java
│       │   └── AlertSchema.java
│       └── resources/
│           └── flink-conf.yml
│
├── ml-service/                               ← Python 3.11 / Ray Serve
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── pyproject.toml
│   ├── app/
│   │   ├── main.py
│   │   ├── grpc_server.py
│   │   ├── proto/
│   │   │   ├── diagnosis_pb2.py
│   │   │   ├── diagnosis_pb2_grpc.py
│   │   │   └── diagnosis.proto
│   │   ├── models/
│   │   │   ├── symptom_checker.py
│   │   │   ├── xray_analyzer.py
│   │   │   ├── ecg_classifier.py
│   │   │   ├── risk_predictor.py
│   │   │   └── deterioration_detector.py
│   │   ├── serve/
│   │   │   ├── ray_deployment.py
│   │   │   └── model_registry.py
│   │   └── utils/
│   │       ├── preprocessing.py
│   │       └── icd10_lookup.py
│   ├── mlflow/
│   │   ├── mlflow_config.py
│   │   └── experiments/
│   │       ├── symptom_bert_v1/
│   │       ├── xray_cnn_v2/
│   │       ├── ecg_lstm_v1/
│   │       └── risk_xgboost_v3/
│   └── tests/
│       ├── test_symptom_checker.py
│       ├── test_xray_analyzer.py
│       └── test_ecg_classifier.py
│
├── shared-libs/
│   ├── common-dto/
│   │   ├── pom.xml
│   │   └── src/main/java/vn/shms/common/dto/
│   │       ├── PageResponse.java
│   │       ├── ApiResponse.java
│   │       └── ErrorResponse.java
│   ├── common-security/
│   │   ├── pom.xml
│   │   └── src/main/java/vn/shms/common/security/
│   │       ├── JwtUtil.java
│   │       ├── UserContext.java
│   │       └── RoleConstants.java
│   ├── common-kafka/
│   │   ├── pom.xml
│   │   └── src/main/java/vn/shms/common/kafka/
│   │       ├── KafkaTopics.java
│   │       ├── BaseEvent.java
│   │       └── EventSerializer.java
│   └── common-exception/
│       ├── pom.xml
│       └── src/main/java/vn/shms/common/exception/
│           ├── BusinessException.java
│           ├── ResourceNotFoundException.java
│           └── GlobalExceptionHandler.java
│
├── infra/
│   ├── kafka/
│   │   └── topics.sh
│   ├── elasticsearch/
│   │   └── index-mappings.json
│   ├── neo4j/
│   │   └── seed-graph.cypher
│   ├── postgresql/
│   │   └── init.sql
│   ├── redis/
│   │   └── redis.conf
│   ├── ceph/
│   │   └── ceph.conf
│   ├── nginx/
│   │   └── nginx.conf
│   └── prometheus/
│       ├── prometheus.yml
│       └── alertmanager.yml
│
└── docs/

```
