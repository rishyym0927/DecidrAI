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
│   └── api-gateway/           # Express gateway - Port 4000
├── services/                  # Microservices
│   ├── auth-service/          # ✅ Clerk auth + MongoDB sync - Port 5002
│   ├── tool-service/          # ✅ Tool CRUD + Search - Port 5003
│   ├── recommendation-service/ # 🚧 Basic structure only - Port 5001
│   ├── flow-service/          # ❌ Empty (Planned)
│   ├── comparison-service/    # ❌ Empty (Planned)
│   └── analytics-service/     # ❌ Empty (Planned)
├── packages/                  # Shared libraries
│   ├── db/                    # ✅ MongoDB + Redis clients
│   ├── auth/                  # ✅ Clerk utilities (session validation, guards)
│   ├── config/                # ❌ Empty (Planned)
│   ├── errors/                # ❌ Empty (Planned)
│   ├── logger/                # ❌ Empty (Planned)
│   ├── types/                 # ❌ Empty (Planned)
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
| Express Setup | ✅ Done | CORS, JSON parsing |
| Health Check | ✅ Done | `/health` endpoint |
| Auth Middleware | ✅ Done | Clerk JWT validation |
| Protected Route | ✅ Done | `/protected` test route |

**Files:**
- `/apps/api-gateway/src/server.ts` - Main server
- `/apps/api-gateway/src/middleware/auth.middleware.ts` - JWT validation using `@decidrai/auth`

**Missing:**
- Service routing (proxy to microservices)
- Rate limiting
- Request logging
- Error handling middleware

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
- `/services/tool-service/src/models/Tool.ts` - Full Mongoose schema (266 lines)
- `/services/tool-service/src/controllers/tool.controller.ts` - All CRUD (375 lines)
- `/services/tool-service/src/routes/tool.routes.ts` - Route definitions
- `/services/tool-service/src/services/cache.service.ts` - Redis caching
- `/services/tool-service/src/services/search.service.ts` - MongoDB text search
- `/services/tool-service/src/scripts/seed.ts` - 10 sample tools
- `/services/tool-service/src/utils/slugify.ts` - URL slug generator
- `/services/tool-service/src/utils/asyncHandler.ts` - Async error wrapper

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

### 🚧 **SERVICES - PARTIAL**

#### 5. Recommendation Service (`services/recommendation-service/`) - Port 5001
| Component | Status | Details |
|-----------|--------|---------|
| Express Server | ✅ Done | Basic health check |
| MongoDB Connection | ✅ Done | via local `db.ts` |
| Redis Test Route | ✅ Done | `/redis-test` |
| Recommendation Logic | ❌ Missing | No scoring, no tag matching |
| OpenAI Integration | ❌ Missing | No explanation generation |

**Files:**
- `/services/recommendation-service/src/index.ts` - Basic server
- `/services/recommendation-service/src/db.ts` - MongoDB init
- `/services/recommendation-service/src/cache.ts` - Redis client

**What's Needed:**
- Flow answer processing endpoint
- Tag extraction logic
- Tool scoring algorithm
- OpenAI explanation generation
- Redis caching for recommendations

---

### ❌ **SERVICES - NOT IMPLEMENTED**

#### 6. Flow Service (`services/flow-service/`)
**Status:** Empty shell - only directory structure exists

**Existing Directories (all empty):**
- `src/controllers/`
- `src/engine/`
- `src/models/`
- `src/routes/`
- `src/scoring/`

**What's Needed:**
- Flow model (questions, tags, weights)
- Question engine (dynamic rendering)
- Tag extraction from answers
- Scoring algorithm
- CRUD endpoints

---

#### 7. Comparison Service (`services/comparison-service/`)
**Status:** Empty directory

---

#### 8. Analytics Service (`services/analytics-service/`)
**Status:** Empty directory

---

### ✅ **PACKAGES - IMPLEMENTED**

#### 9. DB Package (`packages/db/`)
| Component | Status | Details |
|-----------|--------|---------|
| MongoDB Client | ✅ Done | `connectMongo()`, `disconnectMongo()` |
| Redis Client | ✅ Done | `getRedisClient()` singleton |
| Exports | ✅ Done | Published as `db` package |

**Files:**
- `/packages/db/src/mongo.ts` - Mongoose connection
- `/packages/db/src/redis.ts` - ioredis client
- `/packages/db/src/index.ts` - Combined exports

---

#### 10. Auth Package (`packages/auth/`)
| Component | Status | Details |
|-----------|--------|---------|
| Session Validation | ✅ Done | `validateClerkSession()` using `@clerk/backend` |
| Internal Auth Guard | ✅ Done | `requireInternalAuth()` for service-to-service |
| Exports | ✅ Done | Published as `@decidrai/auth` |

**Files:**
- `/packages/auth/src/session.ts` - Clerk token verification
- `/packages/auth/src/guard.ts` - Service secret validation
- `/packages/auth/src/index.ts` - Combined exports

---

### ❌ **PACKAGES - NOT IMPLEMENTED**
- `packages/config/` - Empty
- `packages/errors/` - Empty
- `packages/logger/` - Empty
- `packages/types/` - Empty
- `packages/schemas/` - Empty

---

### ✅ **EXTRAS - IMPLEMENTED**

#### 11. API Playground (`api-playground/`)
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
| API Gateway | 🚧 Partial | 50% |
| **Services** | | |
| Auth Service | ✅ Complete | 100% |
| Tool Service | ✅ Complete | 100% |
| Recommendation Service | 🚧 Partial | 15% |
| Flow Service | ❌ Not Started | 0% |
| Comparison Service | ❌ Not Started | 0% |
| Analytics Service | ❌ Not Started | 0% |
| **Packages** | | |
| DB Package | ✅ Complete | 100% |
| Auth Package | ✅ Complete | 100% |
| Config Package | ❌ Not Started | 0% |
| Logger Package | ❌ Not Started | 0% |
| Types Package | ❌ Not Started | 0% |
| Schemas Package | ❌ Not Started | 0% |
| Errors Package | ❌ Not Started | 0% |

---

## 🎯 NEXT STEPS (Recommended Order)

### Immediate Priority
1. **Flow Service** - Core user-facing feature
   - Flow model with question schema
   - Tag mapping logic
   - CRUD endpoints
   
2. **Complete Recommendation Service**
   - Connect to Flow Service
   - Implement scoring algorithm
   - Add OpenAI explanation generation

### Secondary Priority
3. **Frontend Tool Pages**
   - Tool detail page (`/tools/[slug]`)
   - Category pages
   - Search UI

4. **API Gateway Routing**
   - Proxy requests to services
   - Add rate limiting

### Nice to Have
5. **Admin Panel** - Tool management UI
6. **Comparison Service** - Side-by-side analysis
7. **Analytics Service** - User tracking

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
- [ ] No centralized error handling
- [ ] No shared types package (duplicated types across services)
- [ ] No logging infrastructure
- [ ] No tests written
- [ ] API Gateway doesn't route to services yet
- [ ] Frontend uses mock data for tools (not connected to API)
- [ ] Missing input validation (Zod schemas)

---

**Last Updated:** 2025-12-17  
**Version:** 2.0 (Major revision - accurate implementation status)
