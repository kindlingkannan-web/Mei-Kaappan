# Mei-Kaappan — System Architecture & Deployment Guide

**SurakshaShield / Mei-Kaappan: Intelligent Scam Prevention & Protection System**

This document provides complete instructions for configuring, building, running, and deploying the **Next.js Frontend**, **Java Spring Boot 2.7 REST API**, and **PostgreSQL 16 Database** both locally and in production environments.

---

## 1. System Architecture

```
┌────────────────────────────────┐         REST / JSON          ┌───────────────────────────────────┐
│        Next.js Frontend        │ ───────────────────────────> │     Java Spring Boot REST API     │
│   (React 19 / Tailwind / TS)   │                              │   (Spring Data JPA / Flyway)      │
│   Port: 3000                   │ <─────────────────────────── │   Port: 8080 (Context: /api/v1)   │
└────────────────────────────────┘         CORS Enabled         └─────────────────┬─────────────────┘
                                                                                  │
                                                                                  │ JDBC Pool (HikariCP)
                                                                                  ▼
                                                                ┌───────────────────────────────────┐
                                                                │        PostgreSQL Database        │
                                                                │     Schema: public (11 tables)    │
                                                                │     Port: 5432                    │
                                                                └───────────────────────────────────┘
```

### Persistence & Data Layer Design
1. **Frontend Repository Adapter (`src/services/api-adapter.ts`)**:
   - Implements `IRepository` interface identical to `DemoRepository`.
   - Switches dynamically based on `NEXT_PUBLIC_DATA_SOURCE="live"`.
   - Communicates via `fetch()` to `NEXT_PUBLIC_API_BASE_URL` (`http://localhost:8080/api/v1`).
2. **Spring Boot Backend (`backend/server`)**:
   - Built on Spring Boot 2.7.18 with OpenJDK 11.
   - Spring Data JPA repositories with Hibernate mapping.
   - Database migrations managed via Flyway (`classpath:db/migration`).
   - CORS filter allows authorized frontend origins.
3. **Database Migrations (`backend/server/src/main/resources/db/migration`)**:
   - `V1__create_schema.sql`: DDL for 11 core tables and indices.
   - `V2__seed_initial_data.sql`: Realistic seed dataset for Indian cyber scam journeys (TNEB power bill cutoff, SBI KYC WhatsApp phishing, Digital Arrest extortion, Lottery advance fee fraud).
   - `V3__alter_trusted_contacts.sql`: Allows optional email for SMS/WhatsApp-only guardian contacts.

---

## 2. Environment Variables Reference

| Variable Name | Required | Default (Local) | Production Example | Description |
| :--- | :---: | :--- | :--- | :--- |
| **Frontend (Next.js)** | | | | |
| `NEXT_PUBLIC_DATA_SOURCE` | Yes | `live` | `live` | Set to `live` for Spring Boot + PostgreSQL, or `demo` for in-memory mock. |
| `NEXT_PUBLIC_DEMO_MODE` | No | `false` | `false` | Disables demo banner when set to `false`. |
| `NEXT_PUBLIC_API_BASE_URL` | Yes | `http://localhost:8080/api/v1` | `https://api.meikaappan.org/api/v1` | Public REST API context path for client requests. |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | No | `true` | `true` | Enables analytics and model evaluation tabs. |
| `NEXT_PUBLIC_MAX_PAYMENT_CHECK_AMOUNT` | No | `500000` | `500000` | Pre-payment safety checker upper monetary ceiling (INR). |
| **Backend (Spring Boot)** | | | | |
| `SERVER_PORT` | No | `8080` | `8080` | Spring Boot HTTP port. |
| `DB_HOST` | No | `localhost` | `db.internal` or RDS endpoint | PostgreSQL database hostname. |
| `DB_PORT` | No | `5432` | `5432` | PostgreSQL database port. |
| `DB_NAME` | No | `meikaappan_db` | `meikaappan_prod` | PostgreSQL database name. |
| `DB_USER` | No | `postgres` | `postgres` | PostgreSQL username. |
| `DB_PASSWORD` | Yes | `postgres` | `[Secure-Password]` | PostgreSQL password. |
| `CORS_ALLOWED_ORIGINS` | No | `http://localhost:3000,http://127.0.0.1:3000` | `https://meikaappan.org` | Comma-separated list of allowed CORS origins. |
| `SPRING_FLYWAY_ENABLED` | No | `true` | `true` | Automatically executes Flyway migrations on startup. |

---

## 3. Local Development Setup

### Prerequisites
- Node.js 18+ & npm
- OpenJDK 11+
- Apache Maven 3.8+
- PostgreSQL 12+

### Step 1: Start PostgreSQL
Ensure PostgreSQL is running locally and the target database exists:
```bash
# If using Windows local binaries:
d:\Mei-Kaappan\backend\pgsql\bin\postgres.exe -D d:\Mei-Kaappan\backend\pgsql\data

# Create database if not created:
createdb -U postgres meikaappan_db
```

### Step 2: Build & Launch Spring Boot Backend
```bash
cd backend/server
mvn clean package -DskipTests
java -jar target/meikaappan-server-1.0.0.jar
```
The server will start on `http://localhost:8080/api/v1` and Flyway will apply migrations automatically.

### Step 3: Run Next.js Frontend
In the root directory:
```bash
# Ensure .env.local contains:
# NEXT_PUBLIC_DATA_SOURCE="live"
# NEXT_PUBLIC_API_BASE_URL="http://localhost:8080/api/v1"

npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 4. End-to-End Verification

A dedicated end-to-end verification script is included at `backend/verify-e2e.js`. It validates full HTTP client lifecycle against Spring Boot and verifies database row persistence:
```bash
node backend/verify-e2e.js
```
The script validates:
1. `GET /users/me` — Fetches current user profile.
2. `POST /alerts/{id}/acknowledge` & `/resolve` — Tests alert workflow and verifies status transitions.
3. `POST /guardian/contacts` & `PATCH /guardian/contacts/{id}/consent` — Creates trusted guardian contacts and updates mutual consent.
4. `PATCH /settings/consent` — Persists privacy, clipboard monitoring, and data retention preferences.
5. `POST /incidents` — Inserts multi-vector scam incident records.
6. `POST /evidence` — Records and links cryptographic / heuristic evidence events.
7. `PATCH /incidents/{id}/status` — Tests status transitions (`ACTIVE` -> `RESOLVED`).
8. `POST /threat-intelligence/reports` — Submits and stores community threat indicators.

---

## 5. Production Docker Deployment

### Docker Compose Example (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: meikaappan_db
    restart: always
    environment:
      POSTGRES_DB: meikaappan_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD:-secure_prod_password}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend/server
      dockerfile: Dockerfile
    container_name: meikaappan_backend
    restart: always
    depends_on:
      - db
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: meikaappan_db
      DB_USER: postgres
      DB_PASSWORD: ${DB_PASSWORD:-secure_prod_password}
      CORS_ALLOWED_ORIGINS: "https://meikaappan.yourdomain.org"
    ports:
      - "8080:8080"

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: meikaappan_frontend
    restart: always
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_DATA_SOURCE: "live"
      NEXT_PUBLIC_API_BASE_URL: "https://api.meikaappan.yourdomain.org/api/v1"
    ports:
      - "3000:3000"

volumes:
  pgdata:
```

### Spring Boot Dockerfile (`backend/server/Dockerfile`)
```dockerfile
FROM maven:3.8.5-openjdk-11-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=build /app/target/meikaappan-server-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```
