# Docker Compose — Toàn bộ hạ tầng 1 file

---

## docker-compose.infra.yml

```yaml
version: '3.8'

services:
  # ── PostgreSQL ──────────────────────────────
  postgres:
    image: postgres:16
    container_name: shms-postgres
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: shms
      POSTGRES_USER: shms
      POSTGRES_PASSWORD: shms123
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./infra/postgresql/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U shms"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ── Redis ───────────────────────────────────
  redis:
    image: redis:7-alpine
    container_name: shms-redis
    ports: ["6379:6379"]
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s

  # ── Zookeeper ───────────────────────────────
  zookeeper:
    image: confluentinc/cp-zookeeper:7.6.0
    container_name: shms-zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  # ── Kafka ───────────────────────────────────
  kafka:
    image: confluentinc/cp-kafka:7.6.0
    container_name: shms-kafka
    ports: ["9092:9092"]
    depends_on: [zookeeper]
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
      KAFKA_LOG_RETENTION_HOURS: 168
    volumes:
      - kafka_data:/var/lib/kafka/data

  # ── Elasticsearch ───────────────────────────
  elasticsearch:
    image: elasticsearch:8.12.0
    container_name: shms-elasticsearch
    ports: ["9200:9200", "9300:9300"]
    environment:
      discovery.type: single-node
      xpack.security.enabled: "false"
      ES_JAVA_OPTS: "-Xms512m -Xmx512m"
    volumes:
      - es_data:/usr/share/elasticsearch/data
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:9200/_cluster/health || exit 1"]
      interval: 15s

  # ── Neo4j ───────────────────────────────────
  neo4j:
    image: neo4j:5
    container_name: shms-neo4j
    ports: ["7474:7474", "7687:7687"]
    environment:
      NEO4J_AUTH: neo4j/shms123456
      NEO4J_PLUGINS: '["apoc"]'
    volumes:
      - neo4j_data:/data
      - ./infra/neo4j/seed-graph.cypher:/var/lib/neo4j/import/seed-graph.cypher

  # ── MinIO (thay Ceph S3) ────────────────────
  minio:
    image: minio/minio
    container_name: shms-minio
    ports: ["9000:9000", "9001:9001"]
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data

  # ── Kafka UI (debug tool) ──────────────────
  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    container_name: shms-kafka-ui
    ports: ["8090:8080"]
    depends_on: [kafka]
    environment:
      KAFKA_CLUSTERS_0_NAME: shms
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092

volumes:
  postgres_data:
  redis_data:
  kafka_data:
  es_data:
  neo4j_data:
  minio_data:
```

---

## Lệnh sử dụng

```bash
# Khởi động tất cả
docker-compose -f docker-compose.infra.yml up -d

# Kiểm tra trạng thái
docker-compose -f docker-compose.infra.yml ps

# Xem logs
docker-compose -f docker-compose.infra.yml logs -f kafka
docker-compose -f docker-compose.infra.yml logs -f postgres

# Dừng tất cả (giữ data)
docker-compose -f docker-compose.infra.yml stop

# Xóa tất cả (kể cả data)
docker-compose -f docker-compose.infra.yml down -v
```

---

## Ports sau khi chạy

| Service | Port | URL |
|---------|------|-----|
| PostgreSQL | 5432 | `psql -h localhost -U shms -d shms` |
| Redis | 6379 | `redis-cli -h localhost` |
| Kafka | 9092 | bootstrap: `localhost:9092` |
| Kafka UI | 8090 | http://localhost:8090 |
| Elasticsearch | 9200 | http://localhost:9200 |
| Neo4j Browser | 7474 | http://localhost:7474 |
| Neo4j Bolt | 7687 | `bolt://localhost:7687` |
| MinIO Console | 9001 | http://localhost:9001 |
| MinIO S3 API | 9000 | `http://localhost:9000` |

---

## Init Scripts

### PostgreSQL (infra/postgresql/init.sql)

```sql
-- Tạo database cho mỗi service
CREATE DATABASE shms_patient;
CREATE DATABASE shms_ehr;
CREATE DATABASE shms_user;
CREATE DATABASE shms_appointment;
CREATE DATABASE shms_medication;
CREATE DATABASE shms_notification;
CREATE DATABASE shms_device;
CREATE DATABASE shms_storage;
CREATE DATABASE shms_gis;
```

### Kafka Topics (infra/kafka/topics.sh)

```bash
#!/bin/bash
KAFKA=shms-kafka
docker exec $KAFKA kafka-topics --create --bootstrap-server localhost:9092 --topic vital.raw --partitions 12 --replication-factor 1
docker exec $KAFKA kafka-topics --create --bootstrap-server localhost:9092 --topic vital.processed --partitions 12 --replication-factor 1
docker exec $KAFKA kafka-topics --create --bootstrap-server localhost:9092 --topic vital.alert --partitions 6 --replication-factor 1
docker exec $KAFKA kafka-topics --create --bootstrap-server localhost:9092 --topic patient.created --partitions 6 --replication-factor 1
docker exec $KAFKA kafka-topics --create --bootstrap-server localhost:9092 --topic patient.updated --partitions 6 --replication-factor 1
docker exec $KAFKA kafka-topics --create --bootstrap-server localhost:9092 --topic appointment.created --partitions 6 --replication-factor 1
docker exec $KAFKA kafka-topics --create --bootstrap-server localhost:9092 --topic appointment.completed --partitions 6 --replication-factor 1
docker exec $KAFKA kafka-topics --create --bootstrap-server localhost:9092 --topic prescription.created --partitions 6 --replication-factor 1
docker exec $KAFKA kafka-topics --create --bootstrap-server localhost:9092 --topic prescription.dispensed --partitions 6 --replication-factor 1
docker exec $KAFKA kafka-topics --create --bootstrap-server localhost:9092 --topic ehr.audit --partitions 3 --replication-factor 1
docker exec $KAFKA kafka-topics --create --bootstrap-server localhost:9092 --topic notification.email --partitions 3 --replication-factor 1
docker exec $KAFKA kafka-topics --create --bootstrap-server localhost:9092 --topic notification.sms --partitions 3 --replication-factor 1
docker exec $KAFKA kafka-topics --create --bootstrap-server localhost:9092 --topic analytics.daily --partitions 1 --replication-factor 1
```

### Neo4j Seed (infra/neo4j/seed-graph.cypher)

```cypher
// Diseases
CREATE (d1:Disease {id:'DIS-001', name:'Nhồi máu cơ tim', icd10:'I21'})
CREATE (d2:Disease {id:'DIS-002', name:'Viêm phổi', icd10:'J18'})
CREATE (d3:Disease {id:'DIS-003', name:'Đái tháo đường type 2', icd10:'E11'})
CREATE (d4:Disease {id:'DIS-004', name:'Tăng huyết áp', icd10:'I10'})
CREATE (d5:Disease {id:'DIS-005', name:'COPD', icd10:'J44'})

// Drugs
CREATE (dr1:Drug {id:'DRUG-001', name:'Amoxicillin', atc:'J01CA04'})
CREATE (dr2:Drug {id:'DRUG-002', name:'Metformin', atc:'A10BA02'})
CREATE (dr3:Drug {id:'DRUG-003', name:'Amlodipine', atc:'C08CA01'})
CREATE (dr5:Drug {id:'DRUG-005', name:'Warfarin', atc:'B01AA03'})
CREATE (dr6:Drug {id:'DRUG-006', name:'Aspirin', atc:'B01AC06'})

// Symptoms
CREATE (s1:Symptom {id:'SYM-001', name:'Đau ngực'})
CREATE (s2:Symptom {id:'SYM-002', name:'Khó thở'})
CREATE (s3:Symptom {id:'SYM-003', name:'Sốt'})
CREATE (s4:Symptom {id:'SYM-004', name:'Ho'})

// Relationships
CREATE (dr1)-[:TREATS {efficacy:'HIGH'}]->(d2)
CREATE (dr2)-[:TREATS {efficacy:'HIGH'}]->(d3)
CREATE (dr3)-[:TREATS {efficacy:'HIGH'}]->(d4)
CREATE (dr5)-[:INTERACTS_WITH {severity:'MAJOR', mechanism:'Tăng nguy cơ xuất huyết'}]->(dr6)
CREATE (d1)-[:HAS_SYMPTOM {frequency:'COMMON'}]->(s1)
CREATE (d1)-[:HAS_SYMPTOM {frequency:'COMMON'}]->(s2)
CREATE (d2)-[:HAS_SYMPTOM {frequency:'COMMON'}]->(s3)
CREATE (d2)-[:HAS_SYMPTOM {frequency:'COMMON'}]->(s4)
CREATE (d4)-[:COMORBID_WITH {prevalence:'HIGH'}]->(d3)
;
```
