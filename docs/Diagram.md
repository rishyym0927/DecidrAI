# DecidrAI – System Architecture & Design Documentation

This document explains the architecture, data flow, database structure, deployment topology, and request lifecycle of **DecidrAI**, an intent-driven AI tool discovery and recommendation platform. The diagrams represent the system as it is designed for production, with clear separation of responsibilities, scalable components, and transparent AI integration.

---

## 1. High-Level Architecture

### Overview

The high-level architecture diagram presents a modular, service-oriented backend supporting an SEO-optimized frontend. The system is divided into **User Layer**, **Frontend**, **Backend Services**, **Data Stores**, and **External Services**.

### Components

#### User & Frontend

* **User (Web Browser):** Initiates requests such as discovering tools, completing intent flows, and viewing recommendations.
* **Frontend (Next.js on Vercel):**

  * Renders UI and intent-based flows
  * Fetches static assets via Cloudflare CDN
  * Communicates with backend via HTTP API calls

#### Backend (Hosted on Render)

* **Express API:** Central entry point for all frontend requests.
* **Flow Engine:** Orchestrates intent flows and extracts tags and intent signals.
* **Authentication Service:** Handles user authentication and authorization.
* **Tool Management Service:** Manages tool metadata and admin operations.
* **Recommendation Service:** Scores and ranks tools based on intent and attributes.
* **Comparison Service:** Generates AI-based comparisons between tools.
* **Analytics Service:** Logs user events and sends metrics to analytics providers.

#### Data Stores

* **MongoDB Atlas:** Primary datastore for tools, users, flows, interactions, and comparisons.
* **Redis (Upstash):** Used for caching recommendations, comparisons, and workflow data.
* **Bull Queue:** Handles background jobs such as AI comparison generation and analytics processing.

#### External Services

* **OpenAI API:** Generates AI-based explanations and comparisons.
* **Analytics Provider (GA / Mixpanel):** Collects usage and engagement metrics.
* **Cloudflare CDN:** Serves static assets and improves performance.

This architecture supports scalability, fault isolation, and clear ownership of responsibilities.


<img width="1526" height="1101" alt="diagram-export-15-12-2025-11_03_48" src="https://github.com/user-attachments/assets/565f4516-5bbe-42f2-a674-1116453ee2d6" />

---

## 2. Data Flow Diagram – Recommendation Pipeline

### Overview

This diagram focuses on how user intent is transformed into personalized tool recommendations.

### Flow Breakdown

1. The user selects an intent and submits answers via the **Intent Flow UI**.
2. The frontend sends answers and interaction events to the **Backend API**.
3. The **Flow Engine** extracts tags and intent signals.
4. The **Recommendation Engine**:

   * Checks Redis cache for existing results
   * Fetches relevant tools from MongoDB if cache misses
5. The backend calls the **OpenAI API** to generate natural-language explanations.
6. Recommendations and explanations are returned to the frontend.
7. User clicks and events are logged in the **Analytics DB**.

This pipeline balances performance (via caching) with explainability (via AI-generated reasoning).

<img width="1439" height="491" alt="diagram-export-15-12-2025-11_07_35" src="https://github.com/user-attachments/assets/d88ee221-ac6f-4d69-b5dd-a546ba0e7262" />

---

## 3. Database Diagram (MongoDB Schema)

### Overview

The database schema is designed around user intent, interactions, and explainable recommendations.

### Core Collections
| Service                    | Database                   | Collections                 |
| -------------------------- | -------------------------- | --------------------------- |
| **auth-service**           | `decidrai_auth`            | `users`        |
| **tool-service**           | `decidrai_tools`           | `tools`, `categories`       |
| **flow-service**           | `decidrai_flows`           | `flows`, `questions`        |
| **recommendation-service** | `decidrai_recommendations` | `recommendations`, `scores` |
| **comparison-service**     | `decidrai_comparisons`     | `comparisons`               |
| **analytics-service**      | `decidrai_analytics`       | `interactions`, `events`    |


---


## 4. Deployment Architecture

### Overview

The deployment diagram illustrates production infrastructure boundaries and data flow between public and internal zones.

### Zones

#### Public Zone

* **Users → Cloudflare → Frontend**
* Cloudflare provides caching, SSL, and protection

#### Internal Zone

* **Backend API (Render / Railway)**
* **Bull Queue:** Handles background analytics and AI comparison generation
* **MongoDB Atlas:** Connected via private networking
* **Redis (Upstash):** Used as a low-latency cache

#### External Services

* **OpenAI API:** Outbound AI requests
* **Sentry:** Error tracking
* **Google Analytics / Mixpanel:** User analytics

This deployment ensures security, scalability, and observability.

<img width="1279" height="565" alt="diagram-export-15-12-2025-11_11_08" src="https://github.com/user-attachments/assets/9eb36024-0cbc-41a5-bb7f-55b2fd71958f" />


---

## 5. Sequence Diagram – Recommendation Lifecycle

### Overview

The sequence diagram shows the end-to-end lifecycle of a recommendation request.

### Steps

1. User starts a recommendation flow.
2. Frontend submits flow answers to backend.
3. Backend processes intent via Flow Engine.
4. Recommendation Engine:

   * Reads from cache or database
   * Computes ranked results
5. OpenAI API generates explanations.
6. Backend returns recommendations to frontend.

7. Frontend renders recommendation cards.
8. User actions are logged asynchronously.

This clearly separates synchronous user-facing logic from asynchronous processing.

<img width="2309" height="2031" alt="diagram-export-15-12-2025-11_20_49" src="https://github.com/user-attachments/assets/7db0e303-9e6a-4008-a56a-363cb409f9ad" />






