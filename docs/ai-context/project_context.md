# DecidrAI Project Context

## 1. Project Identity
**Name:** DecidrAI
**Vision:** "Google for AI Decisions"
**Description:** An intelligent, curated discovery platform helping users choose AI tools via intent-based recommendations (questionnaires) rather than simple directory listings.

## 2. Core Value Proposition
- **Intent-Based Discovery:** Users answer questions; system matches tools.
- **Curated & Verified:** Quality > Quantity.
- **Transparent:** Clear "Why this tool" and "When NOT to use".
- **Comparisons:** AI-generated side-by-side analysis.

## 3. High-Level Architecture
**Type:** Monorepo (Turbo + pnpm)
**Structure:**
- `apps/frontend`: Next.js 14 web app (Client facing).
- `apps/api-gateway`: Main entry point for backend.
- `services/*`: Microservices (Auth, Flow, Tool, Recommendation, etc.).
- `packages/*`: Shared code (DB, Logger, Types).

## 4. Key Entities
- **Tools:** The AI products being recommended.
- **Flows:** Questionnaires (wizard style) leading to recommendations.
- **Comparisons:** Side-by-side tool analysis.
- **Users:** Platform users (saving stacks, history).

## 5. Development Status
- **Phase:** Foundation & Setup.
- **Current Focus:** Infrastructure, Repo Setup, Documentation.
