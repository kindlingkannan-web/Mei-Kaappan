# Mei-Kaappan — Intelligent Scam Prevention & Protection System

> **Mei-Kaappan** (*Tamil: மெய்காப்பான் — "True Guardian / Bodyguard / Faithful Protector"*) is a proactive cybersecurity platform designed to protect citizens, families, and organizations from multi-stage social engineering scams, digital arrest coercion, utility fraud, and mobile financial takeover.

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-Passing-success)](https://github.com/)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

---

## 1. Project Overview & Core Differentiator

Traditional anti-fraud solutions operate as isolated, one-off checks (e.g. caller-ID lookup or spam message filters). Cybercriminals, however, execute **multi-stage attack journeys**:
1. **Initial Hook (SMS / WhatsApp):** Coercive message claiming electricity power cut or police digital arrest warrant within 24 hours.
2. **Deceptive Link (Lookalike Domain):** Victim is directed to a lookalike website (`electricity-bill-pay.xyz`) rather than the official utility portal.
3. **Device Compromise (Malicious APK / Remote Tool):** Victim is instructed to download an APK or remote tool (`AnyDesk` / `QuickSupport`) granting **Accessibility Service** or **Notification Listener** permissions.
4. **Financial Drain (Fake UPI / Auto-Debit):** Attacker coerces a "₹10 verification fee" to an unverified UPI handle while secretly intercepting OTPs.

### 🛡️ The Scam Journey Correlation Engine
Mei-Kaappan's primary innovation is the **Scam Journey Correlation Engine**. Rather than treating events in isolation, it:
- Correlates disparate cyber evidence events across time using shared anchors (phone numbers, URLs, domains, UPI IDs, temporal proximity).
- Reconstructs a **chronological incident timeline** explaining exactly how and why risk escalated.
- Applies a **transparent, non-linear compounding risk model** (0–100) preventing double-counting while penalizing correlated progression.
- Provides **explainable factor breakdowns** ("Why was this flagged?") including mitigating reassuring signals.
- Broadcasts emergency alerts to a **Consent-Based Family Guardian** network.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Next.js Frontend (TypeScript)               │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ 12 Responsive Views                                  │   │
│   │ Overview • Scam Journey • Scanner • Pre-Payment     │   │
│   │ Device Posture • Threat Intel • Alerts • Guardian   │   │
│   │ Reports • Trends & Analytics • Evaluation • Settings │   │
│   └─────────────────────────────────────────────────────┘   │
│                              │                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Global Reactive State (AppContext)                  │   │
│   └─────────────────────────────────────────────────────┘   │
│                              │                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Typed API Boundary: IRepository Interface           │   │
│   └──────────────────────────┬──────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│     DemoRepository (Active)   │   │  SpringBootApiAdapter (Ready) │
│  • In-Memory + LocalStorage   │   │  • HTTP REST Client           │
│  • Consistent Seed Dataset    │   │  • Connects to Java Backend   │
│  • Instant Reset Support      │   │  • DTO <-> Entity Mapping     │
└───────────────────────────────┘   └──────────────┬────────────────┘
                                                   │
                                                   ▼
                                    ┌───────────────────────────────┐
                                    │     Java Spring Boot REST     │
                                    │  • Spring Data JPA / Hibernate│
                                    │  • MySQL / PostgreSQL DB      │
                                    │  • Android Companion Service  │
                                    └───────────────────────────────┘
```

### Clean Architecture Boundary
The frontend does NOT embed database logic inside React components. All interactions route through `IRepository` (`src/services/repository.ts`).
- In **Demo Mode** (`NEXT_PUBLIC_DATA_SOURCE="demo"`), the application operates seamlessly using `DemoRepository` with realistic seed data.
- In **Live Mode** (`NEXT_PUBLIC_DATA_SOURCE="live"`), `SpringBootApiAdapter` connects to the Java Spring Boot REST server.

---

## 3. The 12 Application Sections

1. **Overview Dashboard (`/`):** Unified KPIs, active high-risk and critical incidents, alert triage status, Recharts risk distribution charts, and quick scan launchers.
2. **Scam Journey Explorer (`/incidents` & `/incidents/[id]`):** Multi-stage incident details, interactive correlation timeline, state transitions (Under Review, Resolved, Dismissed), audit log, and real-time evidence correlation.
3. **Message & URL Scanner (`/scanner`):** Client-side SSRF-safe parser detecting urgency triggers, credential traps, lookalike domains, shorteners, and brand impersonation.
4. **Pre-Payment Safety Check (`/payment-check`):** UPI ID syntax verification, threat intelligence blacklist matching, amount risk warnings, and the Golden Rule: *Entering UPI PIN always sends money, never receives.*
5. **Device Exposure Assessment (`/device-exposure`):** Simulated Android client auditor detecting Accessibility abuse, screen overlays (`SYSTEM_ALERT_WINDOW`), notification listeners, and unattended remote access tools.
6. **Threat Intelligence & Reputation (`/threat-intel`):** Centralized directory of flagged phone numbers, domains, UPI IDs, and app packages with confidence ratings and relationship exploration.
7. **Alerts & Notifications (`/alerts`):** Centralized alert inbox with severity filtering, acknowledgement workflows, and resolution states.
8. **Family Guardian (`/guardian`):** Consent-based protection network dispatching emergency push alerts to trusted family members during severe coercion.
9. **Incident Reports & Reconstruction (`/reports`):** Formal dossier generator with print-friendly layout (`window.print()`), Markdown report download, and CSV timeline export.
10. **Scam Trends & Analytics (`/analytics`):** Longitudinal threat telemetry, weekly attack volume trajectories, category distributions, and anchor frequency tables.
11. **Feedback & Model Evaluation (`/evaluation`):** ML governance workspace displaying 2x2 confusion matrix, Precision/Recall/F1 scores, baseline comparisons, false-positive error analysis, and community feedback.
12. **Settings, Privacy & Consent (`/settings`):** Configurable data retention windows (30/90/180 days), guardian sharing controls, full JSON state export, and demo reset.

---

## 4. Java Spring Boot & Relational Database Integration

The application domain models map directly to Java 21 / Spring Boot 3.x entities:

### Entity & JPA Schema Mapping
- **`User`** &rarr; `@Entity @Table(name = "users")`
  - `id (UUID)`, `name`, `email`, `phone`, `role`, `guardian_enabled`
- **`Incident`** &rarr; `@Entity @Table(name = "incidents")`
  - `id (String PK)`, `user_id (FK)`, `title`, `category`, `current_risk_score`, `severity`, `status`, `primary_attacker_vector`, `created_at`, `updated_at`
- **`EvidenceEvent`** &rarr; `@Entity @Table(name = "evidence_events")`
  - `id (String PK)`, `type`, `source`, `raw_payload`, `confidence`, `evidence_quality`, `risk_contribution`, `created_at`
- **`IncidentEvidence`** &rarr; `@Entity @Table(name = "incident_evidences")`
  - `incident_id (FK)`, `evidence_id (FK)`, `association_reason`, `linked_at`
- **`ThreatIndicator`** &rarr; `@Entity @Table(name = "threat_indicators")`
  - `id`, `type`, `value`, `normalized_value`, `reputation_status`, `report_count`, `confidence`, `first_reported`, `last_reported`
- **`Alert`** &rarr; `@Entity @Table(name = "alerts")`
  - `id`, `incident_id (FK)`, `severity`, `title`, `summary`, `is_read`, `is_acknowledged`, `resolution_status`, `guardian_notified`

### Standard REST Endpoints Expected from Spring Boot:
```
GET    /api/v1/incidents                 -> List<IncidentDTO>
GET    /api/v1/incidents/{id}             -> IncidentDetailDTO
POST   /api/v1/incidents                 -> Create incident
PATCH  /api/v1/incidents/{id}/status      -> Update status with audit note
POST   /api/v1/incidents/{id}/evidence   -> Correlate new evidence event
POST   /api/v1/scanner/analyze           -> Heuristic & ML analysis
POST   /api/v1/payments/check            -> Pre-payment threat match
GET    /api/v1/device/findings           -> Device exposure list
GET    /api/v1/threat-intel/indicators   -> Query threat reputation
POST   /api/v1/guardian/contacts         -> Add trusted contact
```

---

## 5. Local Setup & Running Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/Mei-Kaappan.git
cd Mei-Kaappan

# Install dependencies
npm install

# Run automated rule & scoring test suite
npm test

# Launch local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Deployment to Vercel

Mei-Kaappan is fully optimized for continuous deployment on **Vercel**:

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import the `Mei-Kaappan` repository.
4. Configure Build & Development Settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `next build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
5. Configure Environment Variables (from `.env.example`):
   ```ini
   NEXT_PUBLIC_APP_NAME="Mei-Kaappan"
   NEXT_PUBLIC_APP_SUBTITLE="Intelligent Scam Prevention & Protection System"
   NEXT_PUBLIC_APP_VERSION="1.0.0-prototype"
   NEXT_PUBLIC_DATA_SOURCE="demo"
   NEXT_PUBLIC_DEMO_MODE="true"
   NEXT_PUBLIC_API_BASE_URL="http://localhost:8080/api/v1"
   ```
6. Click **Deploy**. Vercel will build and assign an HTTPS production domain.

---

## 7. Security & Academic Demonstration Disclaimer

- **SSRF Safety:** Submitted URLs are safely analyzed on the client side using lexical and structural heuristics. No arbitrary network sockets or web requests are made to unverified endpoints.
- **Privacy First:** Mei-Kaappan does NOT read private WhatsApp databases, record ambient microphone audio, or surveil host OS files without explicit user interaction.
- **Financial Boundary:** This application does NOT connect to core banking switches or execute transactions. It provides preventative safety advisories.
- **Prototype Transparency:** Prototype assessments, heuristic scores, and simulated findings are clearly identified with prominent **DEMO MODE** indicators.

---

## 8. License

Developed for educational, research, and cybersecurity innovation demonstration. Licensed under the MIT License.
