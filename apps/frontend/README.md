# DecidrAI Frontend

> **The Google for AI Decisions** - An intelligent, curated discovery platform for AI tools.

---

## 📖 Documentation

- **[PAGES.md](./PAGES.md)** ← **ALL PAGE STRUCTURES** - Complete list of all 19 pages
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Everything you need to build pages
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Cheat sheet for quick lookups
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed architecture explanation

---

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Clerk keys

# Start dev server
pnpm dev
# Open http://localhost:3000
```

---

## 🛠️ Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **TailwindCSS v4** - Styling
- **Clerk** - Authentication
- **Axios** - HTTP client
- **TanStack Query** - Server state & caching
- **React Hot Toast** - Notifications

---

## 📁 Project Structure

```
src/
├── app/              # Pages (add your routes here)
├── hooks/            # React Query hooks (use these for data)
├── lib/api/          # API functions
├── components/       # Reusable UI components
├── providers/        # App providers (already set up)
├── types/            # TypeScript types
└── contexts/         # React contexts
```

---

## 🎯 Building a Page (Example)

```typescript
// src/app/tools/page.tsx
'use client';

import { useTools } from '@/hooks';

export default function ToolsPage() {
  const { data, isLoading, error } = useTools({ limit: 20 });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error!</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">AI Tools</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data?.data?.tools?.map((tool) => (
          <div key={tool.id} className="p-6 border rounded-lg">
            <h3 className="font-semibold text-xl">{tool.name}</h3>
            <p className="text-gray-600 mt-2">{tool.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**That's it!** React Query handles loading, caching, and error states automatically.

---

## 🪝 Available Hooks

All hooks are imported from `@/hooks`:

```typescript
// Tools
useTools({ category, limit })
useTool(slug)
useSearchTools(query)

// Flows
useFlows()
useFlow(slug)
useStartFlow()          // mutation
useSubmitAnswer()       // mutation
useCompleteFlow()       // mutation

// Recommendations
useRecommendationsBySession(sessionId)
useGetRecommendations() // mutation

// Comparisons
useCompareTools(slugs)
usePopularComparisons()
```

---

## 🔔 Toast Notifications

```typescript
import { showToast } from '@/lib/toast';

showToast.success('Success!');
showToast.error('Error!');
showToast.loading('Loading...');
```

---

## 📦 What's Already Set Up

✅ Axios with interceptors  
✅ React Query with caching  
✅ Toast notifications  
✅ Dark mode support  
✅ Clerk authentication  
✅ TypeScript types  
✅ All providers configured  

---

## 💡 Key Points

1. **Use hooks, not API functions directly** - Hooks provide caching and loading states
2. **Add `'use client'`** to components using hooks
3. **Check `isLoading`** before accessing data
4. **Use `data?.data?.field`** for safe access
5. **Read [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** for detailed examples

---

## 🔧 Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter
```

---

## 🌐 Environment Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

**Ready to build? Read [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) and start coding!** 🚀
