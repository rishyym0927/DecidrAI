# DecidrAI Frontend

> **The Google for AI Decisions** - An intelligent, curated discovery platform that helps users choose the right AI tools quickly and confidently.

## 🎯 Overview

DecidrAI is a Next.js 14 application that provides an intent-driven AI tool discovery experience. Instead of overwhelming users with endless directories, we use questionnaire-based flows to deliver personalized recommendations powered by AI.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [TailwindCSS](https://tailwindcss.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **State Management:** React Context API
- **API Communication:** Native Fetch API
- **Fonts:** Geist Sans & Geist Mono

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Homepage (composed from components)
│   └── globals.css            # Global styles & Tailwind
├── components/                 # React components
│   ├── layout/                # Layout components
│   │   ├── Header.tsx         # Navigation header
│   │   └── Footer.tsx         # Site footer
│   ├── home/                  # Homepage sections
│   │   ├── HeroSection.tsx
│   │   ├── DiscoveryFlowsSection.tsx
│   │   ├── CategoriesSection.tsx
│   │   ├── FeaturedToolsSection.tsx
│   │   └── CTASection.tsx
│   └── ui/                    # Reusable UI primitives
│       └── icons/             # Icon components
├── contexts/                   # React Context providers
│   └── ThemeContext.tsx       # Dark mode theme provider
├── lib/                       # Utilities & configurations
│   ├── api/                   # API client layer
│   │   ├── client.ts          # Base API client
│   │   ├── tools.ts           # Tool service endpoints
│   │   ├── flows.ts           # Flow service endpoints
│   │   ├── recommendations.ts # Recommendation endpoints
│   │   └── comparisons.ts     # Comparison endpoints
│   └── constants.ts           # App-wide constants
├── types/                     # TypeScript type definitions
│   ├── tool.ts
│   ├── flow.ts
│   ├── recommendation.ts
│   ├── comparison.ts
│   └── api.ts
├── data/                      # Static/mock data
│   ├── categories.ts
│   ├── discoveryFlows.ts
│   └── featuredTools.ts
└── middleware.ts              # Clerk auth middleware
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Clerk account for authentication

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   
   Create a `.env.local` file in the frontend directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # API Gateway URL (default: http://localhost:4000/api)
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
pnpm build
pnpm start
```

## 🔌 API Integration

The frontend communicates with the **API Gateway** running at `http://localhost:4000/api`. All microservices are accessed through this unified gateway.

### Tool Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tools` | Get all tools (pagination, filters, sorting) |
| `GET` | `/api/tools/search?q=query` | Search tools by query |
| `GET` | `/api/tools/:slug` | Get tool details by slug |
| `GET` | `/api/tools/:slug/related` | Get related tools |

**Example Usage:**
```typescript
import { getTools, searchTools } from '@/lib/api/tools';

// Get all tools
const response = await getTools({ category: 'Design', limit: 10 });

// Search tools
const results = await searchTools('image generation');
```

---

### Flow Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/flows` | Get all discovery flows |
| `GET` | `/api/flows/:slug` | Get flow details by slug |
| `POST` | `/api/flows/:slug/start` | Start a new flow session |
| `POST` | `/api/flows/sessions/:sessionId/answer` | Submit answer to current question |
| `GET` | `/api/flows/sessions/:sessionId` | Get session status (for resuming) |
| `POST` | `/api/flows/sessions/:sessionId/complete` | Complete flow and get extracted tags |

**Example Usage:**
```typescript
import { startFlow, submitAnswer, completeFlow } from '@/lib/api/flows';

// Start a flow
const session = await startFlow('content-creation');

// Submit an answer
const next = await submitAnswer(session.sessionId, 'Blog posts');

// Complete the flow
const tags = await completeFlow(session.sessionId);
```

---

### Recommendation Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/recommend` | Get recommendations based on tags |
| `GET` | `/api/recommend/session/:sessionId` | Get recommendations from flow session |

**Example Usage:**
```typescript
import { getRecommendations, getRecommendationsBySession } from '@/lib/api/recommendations';

// Get recommendations by tags
const recs = await getRecommendations({
  tags: ['content-creation', 'blog', 'seo'],
  limit: 5
});

// Get recommendations from a completed flow
const sessionRecs = await getRecommendationsBySession(sessionId);
```

---

### Comparison Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/compare?tools=slug1,slug2` | Compare tools (cached) |
| `POST` | `/api/compare` | Force regenerate comparison |
| `GET` | `/api/compare/popular` | Get popular comparisons |

**Example Usage:**
```typescript
import { compareTools, getPopularComparisons } from '@/lib/api/comparisons';

// Compare two tools
const comparison = await compareTools(['chatgpt', 'claude']);

// Get popular comparisons
const popular = await getPopularComparisons();
```

---

### Auth Service Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/auth/me` | Get current user profile | ✅ Yes |

**Note:** Authentication is handled client-side by Clerk. The API Gateway validates JWT tokens for protected routes.

---

## 🎨 Key Features

### Implemented
- ✅ **Modern UI/UX** - Medium-inspired design with dark mode support
- ✅ **Clerk Authentication** - Secure sign-in/sign-up with social providers
- ✅ **Responsive Design** - Mobile-first approach with TailwindCSS
- ✅ **Theme Toggle** - Persistent dark/light mode with system preference detection
- ✅ **Component Architecture** - Modular, reusable components
- ✅ **Type Safety** - Full TypeScript coverage with strict mode
- ✅ **API Client Layer** - Typed API client for all microservices

### Planned
- 🔄 **Discovery Flow UI** - Interactive questionnaire interface
- 🔄 **Tool Detail Pages** - Individual tool pages with full information
- 🔄 **Comparison UI** - Side-by-side tool comparison interface
- 🔄 **Search Functionality** - Real-time tool search with filters
- 🔄 **Admin Panel** - Tool and flow management interface

## 🔧 Development

### Code Style
- Use TypeScript for all new files
- Follow the existing component structure
- Use TailwindCSS for styling (avoid inline styles)
- Keep components small and focused
- Use barrel exports (`index.ts`) for cleaner imports

### Path Aliases
The project uses `@/` as an alias for the `src/` directory:

```typescript
// ✅ Good
import { getTools } from '@/lib/api/tools';
import HeroSection from '@/components/home/HeroSection';

// ❌ Avoid
import { getTools } from '../../../lib/api/tools';
```

### Adding New API Endpoints
1. Define types in `src/types/`
2. Create/update API client in `src/lib/api/`
3. Use the typed client in components

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | ✅ Yes | - |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ Yes | - |
| `NEXT_PUBLIC_API_URL` | API Gateway base URL | No | `http://localhost:4000/api` |

## 🤝 Contributing

1. Create a new branch for your feature
2. Follow the existing code structure and conventions
3. Ensure TypeScript types are properly defined
4. Test your changes locally
5. Submit a pull request

## 📄 License

This project is part of the DecidrAI monorepo.

---

**Built with ❤️ using Next.js 14 and TypeScript**
