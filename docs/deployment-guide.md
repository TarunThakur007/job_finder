# JobProof — Deployment & DevOps Engineering Guide

---

## 1. Architecture & Deployment Topologies

JobProof is architected for frictionless portability across environments—from single-machine local development to containerized cloud production (AWS, GCP, DigitalOcean, or Azure).

```
[ Internet Users ]
       │ HTTPS (443)
┌──────▼───────────────────────────────────────────────────────┐
│               Nginx Reverse Proxy / Cloudflare               │
│        (SSL Termination, Gzip/Brotli, Static Asset Cache)    │
└──────┬───────────────────────────────────────────────┬───────┘
       │ / (Static React SPA)                          │ /api/* (REST API)
┌──────▼────────────────────────┐       ┌──────────────▼────────────────┐
│   Frontend Nginx Container    │       │  Spring Boot Backend Container │
│ (Port 80 / Static HTML/JS/CSS)│       │  (Java 21, Port 8081)          │
└───────────────────────────────┘       └──────────────┬────────────────┘
                                                       │ JDBC (Port 5432)
                                        ┌──────────────▼────────────────┐
                                        │  PostgreSQL 15+ Database      │
                                        │  (Persistent Volume Storage)  │
                                        └───────────────────────────────┘
```

---

## 2. Environment Matrix & Prerequisites

| Requirement | Local Development | Staging / QA | Production |
| :--- | :--- | :--- | :--- |
| **Java Runtime** | OpenJDK 21+ | OpenJDK 21 | Eclipse Temurin 21-jre-alpine |
| **Node.js** | Node.js 18+ & npm 9+ | Node.js 20 | Static build in Docker |
| **Database** | H2 In-Memory (`jdbc:h2:mem:jobproofdb`) | PostgreSQL 15 | Managed PostgreSQL (RDS / Aurora) |
| **Reverse Proxy** | Vite Proxy (`localhost:8081`) | Docker Nginx | Nginx + Certbot Let's Encrypt SSL |
| **RAM / CPU** | 4GB RAM, 2 Cores | 8GB RAM, 4 Cores | 16GB RAM, 8 Cores (Cluster) |

---

## 3. Environment Variables & Secret Configuration

Create a `.env` file or export the following environment variables in your deployment environment:

```ini
# ==========================================
# BACKEND RUNTIME CONFIGURATION
# ==========================================
SERVER_PORT=8081
SPRING_PROFILES_ACTIVE=prod

# Database Connection (PostgreSQL Production)
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres-db:5432/jobproof
SPRING_DATASOURCE_USERNAME=jobproof_admin
SPRING_DATASOURCE_PASSWORD=YourStrongDatabasePassword123!
SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
SPRING_JPA_DIALECT=org.hibernate.dialect.PostgreSQLDialect
SPRING_JPA_DDL_AUTO=update

# Security & Tokens
JWT_SECRET=jobproof_production_secure_jwt_secret_key_minimum_32_characters_long_2026

# AI & LLM Engine (Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

# Scheduler Configuration (Cron)
JOBPROOF_SCHEDULER_DISCOVERY_CRON=0 0 */6 * * *
JOBPROOF_SCHEDULER_FRESHNESS_CRON=0 0 * * * *
```

---

## 4. Local Development Execution

### Backend Run
```powershell
cd backend
mvn clean compile
mvn spring-boot:run
```
*Health Check*: `http://localhost:8081/api/health`  
*H2 Console*: `http://localhost:8081/h2-console` (JDBC URL: `jdbc:h2:mem:jobproofdb`)

### Frontend Run
```powershell
cd frontend
npm install
npm run dev
```
*Frontend URL*: `http://localhost:5173`

---

## 5. Production Build & Packaging

### Step 1: Build Frontend Production Artifacts
```bash
cd frontend
npm install
npm run build
```
*Output*: Optimized static distribution files generated in `frontend/dist/`.

### Step 2: Build Backend Production JAR
```bash
cd backend
mvn clean package -DskipTests
```
*Output*: Standalone executable JAR generated at `backend/target/jobproof-backend-1.0.0-SNAPSHOT.jar`.

---

## 6. Containerization (Docker & Docker Compose)

### 6.1 Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
# Stage 1: Build stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-XX:+UseG1GC", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
```

### 6.2 Frontend Dockerfile (`frontend/Dockerfile`)
```dockerfile
# Stage 1: Build React SPA
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Nginx Web Server
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 6.3 Unified Production `docker-compose.yml`
```yaml
version: '3.8'

services:
  # Database Service
  postgres-db:
    image: postgres:15-alpine
    container_name: jobproof-db
    restart: always
    environment:
      POSTGRES_DB: jobproof
      POSTGRES_USER: jobproof_admin
      POSTGRES_PASSWORD: YourStrongDatabasePassword123!
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ../database/schema.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - jobproof-network

  # Backend REST API Service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: jobproof-backend
    restart: always
    depends_on:
      - postgres-db
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-db:5432/jobproof
      SPRING_DATASOURCE_USERNAME: jobproof_admin
      SPRING_DATASOURCE_PASSWORD: YourStrongDatabasePassword123!
      JWT_SECRET: jobproof_production_secure_jwt_secret_key_minimum_32_characters_long_2026
      GEMINI_API_KEY: ${GEMINI_API_KEY}
    ports:
      - "8081:8081"
    networks:
      - jobproof-network

  # Frontend Nginx Web Service
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: jobproof-frontend
    restart: always
    depends_on:
      - backend
    ports:
      - "80:80"
      - "443:443"
    networks:
      - jobproof-network

volumes:
  postgres_data:

networks:
  jobproof-network:
    driver: bridge
```

---

## 7. Nginx Production Reverse Proxy Configuration (`nginx.conf`)

```nginx
server {
    listen 80;
    server_name jobproof.io www.jobproof.io;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name jobproof.io www.jobproof.io;

    ssl_certificate /etc/letsencrypt/live/jobproof.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jobproof.io/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Frontend Single Page App Routing
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend REST API Proxy
    location /api/ {
        proxy_pass http://backend:8081/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_read_timeout 60s;
    }
}
```

---

## 8. Continuous Integration & Continuous Deployment (CI/CD)

Automated deployment workflow via GitHub Actions (`.github/workflows/deploy.yml`):

```yaml
name: JobProof Production CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
          cache: maven

      - name: Test & Package Backend
        run: |
          cd backend
          mvn clean test package -DskipTests

      - name: Set up Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build

      - name: Deploy Containers to Production
        if: github.ref == 'refs/heads/main'
        run: |
          echo "Building & Deploying Docker Containers on Production Droplet..."
          docker compose -f docker-compose.yml up -d --build
```

---

## 9. Observability & Maintenance Runbook

### Health Check Endpoint
- **URL**: `https://jobproof.io/api/health`
- **Expected Payload**: `{"status": "UP", "service": "JobRadar AI Backend Platform"}`

### Database Backup Script (Nightly Cron)
```bash
#!/bin/bash
# /etc/cron.daily/jobproof-db-backup
BACKUP_DIR="/var/backups/jobproof"
mkdir -p $BACKUP_DIR
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
docker exec -t jobproof-db pg_dump -U jobproof_admin jobproof | gzip > "$BACKUP_DIR/jobproof_$TIMESTAMP.sql.gz"
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +14 -delete
```
