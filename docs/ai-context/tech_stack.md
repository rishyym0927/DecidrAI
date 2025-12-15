# Tech Stack & Standards

## 1. Technology Stack
| Layer | Technology |
|-------|------------|
| **Monorepo** | Turbo Repo, PNPM Workspaces |
| **Frontend** | Next.js 14 (App Router), React 18 |
| **Styling** | TailwindCSS, shadcn/ui, Lucide Icons |
| **Backend Runtime** | Node.js 20+ (LTS) |
| **Backend Framework** | Express.js (Microservices) |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Caching** | Redis (Upstash) |
| **Queue** | BullMQ |
| **AI/ML** | OpenAI API (GPT-4) for content/comparisons |
| **Validation** | Zod |
| **Types** | TypeScript (Strict) |

## 2. Coding Standards
- **Strict TypeScript:** No `any`. Define interfaces in `packages/types`.
- **Styling:** Use Tailwind utility classes. Avoid custom CSS files.
- **Components:** Functional components. Shadcn/ui for base.
- **API Communication:** Typed requests/responses.
- **State:** React Query for server state, Context for global UI state.

## 3. Directory Conventions
- `apps/` : Deployable applications.
- `packages/` : Shared libraries (must be compiled/transpiled if needed).
- `services/` : Backend microservices.
- `docs/` : Documentation and Knowledge Base.
