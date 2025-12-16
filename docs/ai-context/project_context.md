# DecidrAI - AI Context Documentation

> **📌 Need to request a feature?** Use the template in [`prompt_template.md`](./prompt_template.md)

## 🎯 Project Identity
**Name:** DecidrAI  
**Vision:** "Google for AI Decisions"  
**Purpose:** Intent-driven AI tool discovery platform using questionnaire-based recommendations instead of overwhelming directories.

## 🏗️ Architecture Overview

### Monorepo Structure (Turbo + PNPM)
```
DecidrAI/
├── apps/
│   ├── frontend/          # Next.js 14 (App Router) - Port 3000
│   └── api-gateway/       # Express gateway - Port 4000
├── services/              # Microservices
│   ├── auth-service/      # Clerk auth + MongoDB sync - Port 5002
│   ├── recommendation-service/  # Tool recommendations
│   ├── flow-service/      # (Planned) Intent flow logic
│   ├── tool-service/      # (Planned) Tool CRUD
│   ├── comparison-service/  # (Planned) AI comparisons
│   └── analytics-service/ # (Planned) User tracking
└── packages/              # Shared libraries
    ├── db/                # MongoDB + Redis clients
    ├── auth/              # Clerk utilities
    ├── logger/            # (Planned) Logging
    ├── types/             # (Planned) Shared types
    └── schemas/           # (Planned) Zod schemas
```

## 🔑 Core Concepts

### 1. Intent-Based Discovery
- Users answer contextual questions (flows)
- System extracts tags from answers
- Matching algorithm scores tools (0-100)
- Returns top 2-3 tools with AI-generated explanations

### 2. Key Entities
- **Tools:** AI products with metadata (pricing, categories, use cases)
- **Flows:** Questionnaire wizards (5-7 questions each)
- **Comparisons:** Side-by-side tool analysis with AI reasoning
- **Users:** Clerk-managed auth, MongoDB-synced profiles

### 3. Data Flow
```
User → Flow Questions → Tag Extraction → 
Tool Scoring → OpenAI Explanations → 
Recommendations (cached in Redis)
```

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router, React 18)
- **Styling:** TailwindCSS + shadcn/ui
- **Auth:** Clerk (client-side)
- **State:** React Query (server state), Context (UI state)

### Backend
- **Runtime:** Node.js 20+ (LTS)
- **Framework:** Express.js (microservices)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Cache:** Redis (Upstash)
- **Queue:** BullMQ (background jobs)
- **Auth:** Clerk webhooks → MongoDB sync

### AI/ML
- **LLM:** OpenAI GPT-4 (explanations, comparisons)
- **Future:** Vector search (MongoDB Atlas), TensorFlow.js

### Infrastructure
- **Hosting:** Vercel (frontend), Render/Railway (backend)
- **CDN:** Cloudflare
- **Monitoring:** Sentry (errors), GA4/Mixpanel (analytics)

## 📊 Database Schema (MongoDB)

### Collections
1. **users** (auth-service)
   - `clerkUserId` (unique), `email`, `name`, `image`, `role`
   - Synced via Clerk webhooks

2. **tools** (tool-service) - Planned
   - `name`, `slug`, `tagline`, `description`, `pricing`, `categories`
   - `problems_solved`, `best_for`, `not_good_for`, `learning_curve`
   - `affiliate_link`, `is_sponsored`, `view_count`, `click_count`

3. **flows** (flow-service) - Planned
   - `title`, `slug`, `questions[]`, `required_tags`, `scoring_weights`

4. **interactions** (analytics-service) - Planned
   - `user_id`, `session_id`, `event_type`, `tool_id`, `timestamp`

5. **comparisons** (comparison-service) - Planned
   - `tool_ids[]`, `summary`, `winner_scenarios[]`, `generated_at`

## 🔐 Authentication Flow
1. User signs in via Clerk (frontend)
2. Clerk webhook fires → auth-service `/webhooks/clerk`
3. User created/updated/deleted in MongoDB
4. JWT tokens managed by Clerk
5. API Gateway validates tokens via middleware

## 🚀 Current Status

### ✅ Implemented
- Monorepo setup (Turbo + PNPM)
- Frontend: Next.js with Clerk auth, basic homepage
- Auth Service: Clerk webhook sync, User model
- API Gateway: Basic routing, auth middleware
- Packages: MongoDB + Redis connection utilities

### 🚧 In Progress
- Recommendation service (basic structure)
- Frontend UI/UX refinement

### 📋 Planned (Per PRD)
- Tool CRUD service + admin panel
- Flow engine with 5 core flows
- OpenAI integration for explanations
- Comparison generation
- Search + filtering
- Analytics tracking

## 🎯 Development Priorities

### Phase 1: Foundation (Weeks 1-2) - CURRENT
- ✅ Repo setup, MongoDB/Redis
- ✅ Auth service with Clerk
- 🚧 Tool schema + CRUD APIs
- 🚧 Admin UI for tool management

### Phase 2: Recommendation Engine (Weeks 3-4)
- Design 5 flows (Interview Prep, Content, Automation, Coding, Research)
- Tag extraction + scoring algorithm
- OpenAI explanation generation
- Redis caching

### Phase 3: Directory + Search (Weeks 5-6)
- Tool detail pages (SEO optimized)
- Category taxonomy
- Full-text search (MongoDB Atlas)
- Filtering + sorting

### Phase 4: Comparisons + Trust (Weeks 7-8)
- Comparison UI + generation
- Affiliate tracking
- Transparency features

## 🔧 Key Commands
```bash
pnpm install          # Install all dependencies
pnpm dev              # Run all services in parallel
pnpm build            # Build all apps/services

# Individual services
cd apps/frontend && pnpm dev      # Port 3000
cd apps/api-gateway && pnpm dev   # Port 4000
cd services/auth-service && pnpm dev  # Port 5002
```

## 🌐 Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

### Auth Service (.env)
- `PORT=5002`
- `MONGODB_URI`
- `MONGODB_DB_NAME=decidrai_auth`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`

### API Gateway (.env)
- `PORT=4000`
- `CLERK_SECRET_KEY`

## 📝 Coding Standards
- **TypeScript:** Strict mode, no `any`
- **Styling:** TailwindCSS utilities only
- **Components:** Functional, shadcn/ui base
- **API:** RESTful, typed requests/responses
- **Validation:** Zod schemas
- **Error Handling:** Consistent JSON format `{success, data, message}`

## 🎨 Design Principles
1. **Quality over Quantity:** Curated, verified tools only
2. **Transparency:** Clear "Why this tool" + "When NOT to use"
3. **Intent-First:** Problem-solving, not browsing
4. **Ethical Monetization:** Labeled affiliate links, no pay-to-win rankings
5. **Performance:** <2s page loads, <300ms API responses

## 🔍 Key Files Reference
- **Docs:** `/docs/Architecture.md`, `/docs/Plan.md`, `/docs/Diagram.md`
- **Frontend Entry:** `/apps/frontend/src/app/page.tsx`
- **Auth Service:** `/services/auth-service/src/index.ts`
- **API Gateway:** `/apps/api-gateway/src/server.ts`
- **DB Package:** `/packages/db/src/{mongo,redis}.ts`
- **User Model:** `/services/auth-service/src/models/User.ts`

## 🐛 Known Issues / Tech Debt
- No centralized error handling yet
- Missing shared types package
- No logging infrastructure
- Recommendation service incomplete
- No tests written yet

## 📚 External Dependencies
- **Clerk:** User authentication + webhooks
- **MongoDB Atlas:** Primary database
- **Redis (Upstash):** Caching layer
- **OpenAI API:** AI explanations (planned)
- **Ngrok:** Local webhook testing (dev only)

---

## 📖 How to Use This Documentation

### For Feature Requests
1. Read this document to understand current architecture and status
2. Use [`prompt_template.md`](./prompt_template.md) to structure your request
3. Specify exact locations, requirements, and integration points
4. Reference existing patterns (e.g., "follow auth-service structure")

### For AI Assistants
- Load this file at the start of conversations for full context
- Check "Current Status" to know what's implemented vs. planned
- Follow "Coding Standards" and "Design Principles" for all implementations
- Update this file after implementing features (move from Planned → Implemented)

### Maintenance
- **Update after each feature:** Move items from Planned to Implemented
- **Add new tech debt:** Document issues in "Known Issues" section
- **Keep commands current:** Update if ports or scripts change
- **Version control:** This file should be committed to git

**Last Updated:** 2025-12-16  
**Version:** 1.1
