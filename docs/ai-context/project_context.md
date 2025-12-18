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
│   ├── frontend/              # Next.js 14 (App Router) - Port 3000
│   └── api-gateway/           # ✅ Express gateway - Port 4000
├── services/                  # Microservices
│   ├── auth-service/          # ✅ Clerk auth + MongoDB sync - Port 5002
│   ├── tool-service/          # ✅ Tool CRUD + Search - Port 5003
│   ├── recommendation-service/ # ✅ Tag scoring + AI Explainers - Port 5001
│   ├── flow-service/          # ✅ Flow engine + Sessions - Port 5004
│   ├── comparison-service/    # ✅ AI comparisons - Port 5005
│   └── analytics-service/     # ❌ Empty (Planned)
├── packages/                  # Shared libraries
│   ├── db/                    # ✅ MongoDB + Redis clients
│   ├── auth/                  # ✅ Clerk utilities (session validation, guards)
│   ├── config/                # ❌ Empty (Planned)
│   ├── errors/                # ✅ Standardized Error Classes
│   ├── logger/                # ✅ Shared Logging Logic
│   ├── types/                 # ✅ Shared Types
│   └── schemas/               # ❌ Empty (Planned)
├── api-playground/            # ✅ Interactive API testing UI
├── docs/                      # ✅ Documentation
└── scripts/                   # ❌ Empty
```

---

## 🚀 DETAILED IMPLEMENTATION STATUS

### ✅ **APPS - IMPLEMENTED**

#### 1. Frontend (`apps/frontend/`) - Port 3000
| Component | Status | Details |
|-----------|--------|---------|
| Next.js 14 Setup | ✅ Done | App Router, React 18, TypeScript |
| Clerk Auth | ✅ Done | Client-side authentication |
| TailwindCSS | ✅ Done | Dark mode, responsive design |
| Homepage | ✅ Done | Hero section, categories, featured tools (mock data) |
| Header Component | ✅ Done | Navigation, sign-in/out |
| Auth Middleware | ✅ Done | Route protection via Clerk |

**Files:**
- `/apps/frontend/src/app/page.tsx` - Main homepage
- `/apps/frontend/src/app/layout.tsx` - Root layout with providers
- `/apps/frontend/src/app/components/Header.tsx` - Navigation header
- `/apps/frontend/src/middleware.ts` - Clerk auth middleware

**Missing:**
- Tool detail pages
- Category pages
- Flow/questionnaire UI
- Admin panel
- Search UI

---

#### 2. API Gateway (`apps/api-gateway/`) - Port 4000
| Component | Status | Details |
|-----------|--------|---------|
| Express Setup | ✅ Done | Helmet, CORS, JSON parsing |
| Health Check | ✅ Done | `/health` endpoint |
| Auth Middleware | ✅ Done | Clerk JWT validation |
| Rate Limiting | ✅ Done | Default, AI, Auth limits |
| Request Logger | ✅ Done | Colored console logging |
| Error Handler | ✅ Done | Centralized with 404 |
| Proxy Routes | ✅ Done | All services proxied |
| Test Routes | ✅ Done | /test/services, /test/echo |

**API Routes:**
| Route | Target Service | Auth |
|-------|----------------|------|
| `/api/tools/*` | tool-service:5003 | Admin: Yes |
| `/api/flows/*` | flow-service:5004 | Admin: Yes |
| `/api/compare/*` | comparison-service:5005 | No |
| `/api/recommend/*` | recommendation-service:5001 | No |
| `/api/auth/*` | auth-service:5002 | Varies |

---

### ✅ **SERVICES - IMPLEMENTED**

#### 3. Auth Service (`services/auth-service/`) - Port 5002
| Component | Status | Details |
|-----------|--------|---------|
| Express Server | ✅ Done | Health check, routes |
| Clerk Webhooks | ✅ Done | user.created, user.updated, user.deleted |
| User Model | ✅ Done | clerkUserId, email, name, image, role |
| User Services | ✅ Done | upsertUser, deleteUser, getUserByClerkId, upgradeUserRole |
| MongoDB Connection | ✅ Done | Using shared `packages/db` |

**Files:**
- `/services/auth-service/src/index.ts` - Server entry
- `/services/auth-service/src/models/User.ts` - Mongoose schema
- `/services/auth-service/src/routes/clerkWebhook.ts` - Webhook handler
- `/services/auth-service/src/routes/auth.routes.ts` - Auth endpoints
- `/services/auth-service/src/services/user.service.ts` - User operations

**Working Features:**
- ✅ Clerk webhook sync (create/update/delete users)
- ✅ Role management (user, admin)
- ✅ MongoDB persistence

---

#### 4. Tool Service (`services/tool-service/`) - Port 5003
| Component | Status | Details |
|-----------|--------|---------|
| Express Server | ✅ Done | Health check with DB status |
| Tool Model | ✅ Done | Full schema per PRD (50+ fields) |
| CRUD Controllers | ✅ Done | getAllTools, getBySlug, create, update, delete |
| Search Service | ✅ Done | Text search + fallback regex, related tools |
| Cache Service | ✅ Done | Redis caching with TTLs |
| Seed Script | ✅ Done | 10+ sample AI tools (ChatGPT, Midjourney, etc.) |

**Files:**
- `/services/tool-service/src/index.ts` - Server entry
- `/services/tool-service/src/models/Tool.ts` - Full Mongoose schema
- `/services/tool-service/src/controllers/tool.controller.ts` - All CRUD
- `/services/tool-service/src/routes/tool.routes.ts` - Route definitions
- `/services/tool-service/src/services/cache.service.ts` - Redis caching
- `/services/tool-service/src/services/search.service.ts` - MongoDB text search
- `/services/tool-service/src/scripts/seed.ts` - 10 sample tools

**API Endpoints:**
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/tools` | ✅ Pagination, filters, sorting |
| GET | `/tools/search?q=` | ✅ Full-text search |
| GET | `/tools/:slug` | ✅ With view count increment |
| GET | `/tools/:slug/related` | ✅ Category-based matching |
| POST | `/admin/tools` | ✅ Create tool |
| PATCH | `/admin/tools/:id` | ✅ Update tool |
| DELETE | `/admin/tools/:id` | ✅ Soft delete (archive) |

---

#### 5. Recommendation Service (`services/recommendation-service/`) - Port 5001
| Component | Status | Details |
|-----------|--------|---------|
| Express Server | ✅ Done | Health check with MongoDB/Redis/Gemini status |
| Tag Matching | ✅ Done | Score tools based on tag overlap |
| Ranking | ✅ Done | Diversity penalty, sponsored boost, top N |
| Gemini AI Explainer | ✅ Done | AI-powered recommendation explanations |
| Cross-Service | ✅ Done | Fetches tools from tool-service, sessions from flow-service |
| Cache Service | ✅ Done | Redis caching with TTLs |

**Files:**
- `/services/recommendation-service/src/index.ts` - Server entry
- `/services/recommendation-service/src/matchers/tagMatcher.ts` - Tag scoring
- `/services/recommendation-service/src/ranking/ranking.ts` - Ranking utilities
- `/services/recommendation-service/src/explainers/explainer.ts` - Gemini AI
- `/services/recommendation-service/src/services/recommendation.service.ts` - Orchestration

**API Endpoints:**
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/health` | ✅ With Gemini status |
| POST | `/recommend` | ✅ Tags input → recommendations |
| GET | `/recommend/session/:id` | ✅ From flow session |
| GET | `/redis-test` | ✅ Connection test |

---

#### 6. Flow Service (`services/flow-service/`) - Port 5004
| Component | Status | Details |
|-----------|--------|---------|
| Express Server | ✅ Done | Health check with MongoDB/Redis status |
| Flow Model | ✅ Done | Questions, tags, scoring weights, conditional logic |
| FlowSession Model | ✅ Done | Session tracking with 7-day TTL auto-cleanup |
| CRUD Controllers | ✅ Done | getAllFlows, getBySlug, create, update, delete |
| Session Controllers | ✅ Done | startFlow, submitAnswer, getSession, completeFlow |
| Question Engine | ✅ Done | Dynamic question serving, conditional branching |
| Tag Extraction | ✅ Done | Extract tags from answers with aggregation |
| Scoring Utilities | ✅ Done | Tag matching algorithm, weight application |
| Cache Service | ✅ Done | Redis caching with TTLs |
| Seed Script | ✅ Done | 5 sample flows (interview-prep, content-creation, etc.) |

**Files:**
- `/services/flow-service/src/index.ts` - Server entry
- `/services/flow-service/src/models/Flow.ts` - Flow schema with questions
- `/services/flow-service/src/models/FlowSession.ts` - Session tracking
- `/services/flow-service/src/controllers/flow.controller.ts` - All endpoints
- `/services/flow-service/src/services/flow.service.ts` - Business logic

**API Endpoints:**
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/flows` | ✅ Pagination, category filter |
| GET | `/flows/:slug` | ✅ Flow with questions |
| POST | `/flows/:slug/start` | ✅ Start session, return first question |
| POST | `/flows/sessions/:id/answer` | ✅ Submit answer, get next question |
| GET | `/flows/sessions/:id` | ✅ Get session status (resume) |
| POST | `/flows/sessions/:id/complete` | ✅ Complete flow, return tags |
| POST | `/admin/flows` | ✅ Create flow |
| PATCH | `/admin/flows/:id` | ✅ Update flow |
| DELETE | `/admin/flows/:id` | ✅ Soft delete (archive) |

---

#### 7. Comparison Service (`services/comparison-service/`) - Port 5005
| Component | Status | Details |
|-----------|--------|---------|
| Express Server | ✅ Done | Health check with MongoDB/Redis/Gemini status |
| Comparison Model | ✅ Done | Winner scenarios, feature comparison, caching |
| Gemini AI Generator | ✅ Done | AI-powered comparison generation |
| Cross-Service | ✅ Done | Fetches tools from tool-service |
| Cache Service | ✅ Done | Redis + MongoDB caching (7-day TTL) |

**API Endpoints:**
| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/health` | ✅ With Gemini status |
| GET | `/compare?tools=slug1,slug2` | ✅ Get/generate comparison |
| POST | `/compare` | ✅ Force regenerate |
| GET | `/compare/popular` | ✅ Popular comparisons |

---

### ❌ **SERVICES - NOT IMPLEMENTED**

#### 8. Analytics Service (`services/analytics-service/`)
**Status:** Empty directory (Planned)

---

### ✅ **PACKAGES - IMPLEMENTED**

#### 9. DB Package (`packages/db/`)
| Component | Status | Details |
|-----------|--------|---------|
| MongoDB Client | ✅ Done | `connectMongo()`, `disconnectMongo()` |
| Redis Client | ✅ Done | `getRedisClient()` singleton |
| Exports | ✅ Done | Published as `db` package |

#### 10. Auth Package (`packages/auth/`)
| Component | Status | Details |
|-----------|--------|---------|
| Session Validation | ✅ Done | `validateClerkSession()` using `@clerk/backend` |
| Internal Auth Guard | ✅ Done | `requireInternalAuth()` for service-to-service |
| Exports | ✅ Done | Published as `@decidrai/auth` |

#### 11. Logger Package (`packages/logger/`)
| Component | Status | Details |
|-----------|--------|---------|
| Logger | ✅ Done | Winston/Bunyan based logger |
| Request Logger | ✅ Done | Middleware for Express |
| Exports | ✅ Done | Published as `logger` |

#### 12. Errors Package (`packages/errors/`)
| Component | Status | Details |
|-----------|--------|---------|
| AppError | ✅ Done | Base error class |
| HttpErrors | ✅ Done | NotFound, Unauthorized, BadRequest etc. |
| Exports | ✅ Done | Published as `errors` |

#### 13. Types Package (`packages/types/`)
| Component | Status | Details |
|-----------|--------|---------|
| Shared Types | ✅ Done | Common interfaces and types |
| Exports | ✅ Done | Published as `types` |

---

### ❌ **PACKAGES - NOT IMPLEMENTED**
- `packages/config/` - Empty
- `packages/schemas/` - Empty

---

### ✅ **EXTRAS - IMPLEMENTED**

#### 14. API Playground (`api-playground/`)
Interactive HTML/JS testing UI for all services.

**Files:**
- `index.html` - Main landing page
- `auth.html` - Auth service testing
- `tool.html` - Tool service testing
- `recommendation.html` - Recommendation service testing
- `script.js` - API interaction logic
- `style.css` - Modern dark theme UI

---

## 📊 Summary Table

| Component | Status | Completion |
|-----------|--------|------------|
| **Core Infrastructure** | | |
| Monorepo (Turbo + PNPM) | ✅ Complete | 100% |
| MongoDB Connection | ✅ Complete | 100% |
| Redis Connection | ✅ Complete | 100% |
| **Apps** | | |
| Frontend (Next.js) | 🚧 Partial | 40% |
| API Gateway | ✅ Complete | 100% |
| **Services** | | |
| Auth Service | ✅ Complete | 100% |
| Tool Service | ✅ Complete | 100% |
| Recommendation Service | ✅ Complete | 100% |
| Flow Service | ✅ Complete | 100% |
| Comparison Service | ✅ Complete | 100% |
| Analytics Service | ❌ Not Started | 0% |
| **Packages** | | |
| DB Package | ✅ Complete | 100% |
| Auth Package | ✅ Complete | 100% |
| Logger Package | ✅ Complete | 100% |
| Errors Package | ✅ Complete | 100% |
| Types Package | ✅ Complete | 100% |
| Config Package | ❌ Not Started | 0% |
| Schemas Package | ❌ Not Started | 0% |

---

## 🎯 NEXT STEPS (Recommended Order)

### Immediate Priority
1. **Frontend Flow UI**
   - Implement Flow Questionnaire pages
   - Add OpenAI explanation display
   
2. **Frontend Tool Pages**
   - Tool detail page (`/tools/[slug]`)
   - Category pages
   - Search UI

### Secondary Priority
3. **Admin Panel**
   - Tool management UI
   - Flow management UI

4. **Analytics Service**
   - Implement user tracking

---

## 🌐 Environment Variables

### Frontend (.env.local)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

### Auth Service (.env)
- `PORT=5002`
- `MONGODB_URI`
- `MONGODB_DB_NAME=decidrai_auth`
- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`

### Tool Service (.env)
- `PORT=5003`
- `MONGODB_URI`
- `MONGODB_DB_NAME=decidrai_tools`
- `REDIS_URL`
- `REDIS_TOKEN`

### API Gateway (.env)
- `PORT=4000`
- `CLERK_SECRET_KEY`

---

## 🐛 Known Issues / Tech Debt
- [ ] No centralized input validation (Zod schemas package is empty)
- [ ] Frontend uses mock data for some components (not fully connected to API)
- [ ] Analytics Service is missing
- [ ] Tests are missing

---

**Last Updated:** 2025-12-18
**Version:** 2.1 (Updated implementation status)
