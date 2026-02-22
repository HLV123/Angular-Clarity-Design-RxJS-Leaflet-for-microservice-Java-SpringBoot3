# Cài đặt môi trường Full-Stack SHMS trên Windows

---

## 1. Java 21 
Kiểm tra:

```bash
java -version
javac -version
```

---

## 2. Maven 3.9+ (Build Java)

Kiểm tra:

```bash
mvn -version
```

---

## 3. Node.js 18+ 
Sau khi cài xong:

```bash
node -v
npm -v
npm install -g @angular/cli@17
ng version
```

> Nếu PowerShell báo lỗi chạy script:
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

---

## 4. Python 3.11 (ML Service / Ray Serve)

Kiểm tra:

```bash
python --version
pip --version
```

Cài thư viện ML:

```bash
pip install tensorflow==2.15 scikit-learn xgboost mlflow ray[serve] grpcio grpcio-tools protobuf
```

---

## 5. Docker Desktop (Chạy infrastructure)

Kiểm tra:

```bash
docker --version
docker-compose --version
```

> Docker Desktop yêu cầu **WSL 2**. Nếu chưa có, Windows sẽ hỏi cài khi cài Docker. Hoặc cài trước:
>
> ```powershell
> wsl --install
> ```

---

## 6. PostgreSQL 16 (Database chính)

**Docker (khuyên dùng):**

```bash
docker run -d --name shms-postgres -p 5432:5432 -e POSTGRES_PASSWORD=shms123 -e POSTGRES_DB=shms postgres:16
```

```

Cài xong tạo database:

```bash
psql -U postgres
CREATE DATABASE shms;
```

---

## 7. Redis 7 (Cache / Session)

**Docker:**

```bash
docker run -d --name shms-redis -p 6379:6379 redis:7-alpine
```

---

## 8. Apache Kafka 3.7 (Event streaming)

**Docker (cùng Zookeeper):**

```bash
docker run -d --name shms-zookeeper -p 2181:2181 -e ZOOKEEPER_CLIENT_PORT=2181 confluentinc/cp-zookeeper:7.6.0

docker run -d --name shms-kafka -p 9092:9092 --link shms-zookeeper -e KAFKA_BROKER_ID=1 -e KAFKA_ZOOKEEPER_CONNECT=shms-zookeeper:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 confluentinc/cp-kafka:7.6.0
```

---

## 9. Elasticsearch 8.12 (Tìm kiếm)

**Docker:**

```bash
docker run -d --name shms-elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e "xpack.security.enabled=false" elasticsearch:8.12.0
```

---

## 10. Neo4j 5 (Knowledge Graph)

**Docker:**

```bash
docker run -d --name shms-neo4j -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/shms123456 neo4j:5
```

Mở trình duyệt: `http://localhost:7474`

---

## 11. MinIO (thay Ceph S3 cho dev)

**Docker:**

```bash
docker run -d --name shms-minio -p 9000:9000 -p 9001:9001 -e MINIO_ROOT_USER=minioadmin -e MINIO_ROOT_PASSWORD=minioadmin minio/minio server /data --console-address ":9001"
```

Console: `http://localhost:9001`

---

## Chạy tất cả bằng Docker Compose 

Tạo 1 file `docker-compose.infra.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:16
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: shms
      POSTGRES_PASSWORD: shms123

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  zookeeper:
    image: confluentinc/cp-zookeeper:7.6.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181

  kafka:
    image: confluentinc/cp-kafka:7.6.0
    ports: ["9092:9092"]
    depends_on: [zookeeper]
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1

  elasticsearch:
    image: elasticsearch:8.12.0
    ports: ["9200:9200"]
    environment:
      discovery.type: single-node
      xpack.security.enabled: "false"

  neo4j:
    image: neo4j:5
    ports: ["7474:7474", "7687:7687"]
    environment:
      NEO4J_AUTH: neo4j/shms123456

  minio:
    image: minio/minio
    ports: ["9000:9000", "9001:9001"]
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
```

Chạy toàn bộ infrastructure 1 lệnh:

```bash
docker-compose -f docker-compose.infra.yml up -d
```

Tắt:

```bash
docker-compose -f docker-compose.infra.yml down
```

---

## Thứ tự khởi động project

```
1.  docker-compose -f docker-compose.infra.yml up -d     ← Infrastructure
2.  cd config-server     → mvn spring-boot:run            ← Port 8888
3.  cd service-registry  → mvn spring-boot:run            ← Port 8761
4.  cd api-gateway       → mvn spring-boot:run            ← Port 8080
5.  cd patient-service   → mvn spring-boot:run            ← Port 8081
6.  cd ehr-service       → mvn spring-boot:run            ← Port 8082
7.  cd user-service      → mvn spring-boot:run            ← Port 8083
8.  ... (các service còn lại)
9.  cd ml-service        → python app/main.py             ← gRPC 50051
10. cd frontend          → npm install → ng serve          ← Port 4200
```

Mở trình duyệt: **http://localhost:4200**

---

> **Ccài trực tiếp:** Java, Maven, Angular CLI, Docker.
>
> **6 cái chạy Docker:** PostgreSQL, Redis, Kafka, Elasticsearch, Neo4j, MinIO.
