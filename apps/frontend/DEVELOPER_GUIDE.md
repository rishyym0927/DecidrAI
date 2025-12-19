# DecidrAI Frontend - Developer Guide

> Everything you need to build pages quickly. Keep this open while coding! 📌

---

## 📦 Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **TailwindCSS v4** - Styling
- **Clerk** - Authentication  
- **Axios** - HTTP client
- **TanStack Query** - Server state & caching
- **React Hot Toast** - Notifications

---

## 📁 Folder Structure

```
src/
├── app/                    # 📄 YOUR PAGES GO HERE
│   ├── layout.tsx         # Root layout (providers already set up)
│   └── page.tsx           # Homepage
│
├── hooks/                  # 🪝 USE THESE FOR DATA
│   ├── useTools.ts        # Tools hooks
│   ├── useFlows.ts        # Flows hooks
│   ├── useRecommendations.ts
│   ├── useComparisons.ts
│   └── index.ts           # Import: import { useTools } from '@/hooks'
│
├── lib/
│   ├── api/               # 🔌 API functions (rarely needed directly)
│   ├── toast.ts           # 🔔 showToast utilities
│   └── constants.ts       # App constants
│
├── components/            # 🧩 Reusable UI components
├── providers/             # ✅ Already set up in layout.tsx
├── types/                 # 📝 TypeScript types
└── contexts/              # ThemeContext (dark mode)
```

---

## 🪝 Available Hooks

### Tools (`import from '@/hooks'`)

```typescript
// Get all tools
const { data, isLoading, error } = useTools({ category: 'Design', limit: 10 });

// Get single tool
const { data: tool } = useTool('chatgpt');

// Search tools (only runs when query.length > 0)
const { data: results } = useSearchTools('image generation');

// Related tools
const { data: related } = useRelatedTools('chatgpt');
```

### Flows

```typescript
// Get all flows
const { data: flows } = useFlows();

// Get single flow
const { data: flow } = useFlow('content-creation');

// Get flow session
const { data: session } = useFlowSession('session-id');

// Start flow (mutation)
const startFlow = useStartFlow();
await startFlow.mutateAsync('flow-slug');

// Submit answer (mutation)
const submitAnswer = useSubmitAnswer();
await submitAnswer.mutateAsync({ sessionId: 'xxx', answer: 'Blog posts' });

// Complete flow (mutation)
const completeFlow = useCompleteFlow();
await completeFlow.mutateAsync('session-id');
```

### Recommendations

```typescript
// Get recommendations by session
const { data } = useRecommendationsBySession('session-id');

// Get recommendations by tags (mutation)
const getRecommendations = useGetRecommendations();
await getRecommendations.mutateAsync({ 
  tags: ['design', 'ai'], 
  limit: 5 
});
```

### Comparisons

```typescript
// Compare tools
const { data } = useCompareTools(['chatgpt', 'claude']);

// Popular comparisons
const { data: popular } = usePopularComparisons();

// Regenerate comparison (mutation)
const regenerate = useRegenerateComparison();
await regenerate.mutateAsync(['chatgpt', 'claude']);
```

---

## 🔔 Toast Notifications

```typescript
import { showToast } from '@/lib/toast';

// Simple notifications
showToast.success('Success!');
showToast.error('Error!');

// Loading toast
const id = showToast.loading('Saving...');
showToast.dismiss(id);

// Promise-based (auto success/error)
showToast.promise(
  asyncFunction(),
  {
    loading: 'Saving...',
    success: 'Saved!',
    error: 'Failed!',
  }
);
```

---

## 🎯 Common Patterns

### Pattern 1: Simple Data Fetching Page

```typescript
'use client';

import { useTools } from '@/hooks';

export default function ToolsPage() {
  const { data, isLoading, error } = useTools({ limit: 20 });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error!</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Tools</h1>
      
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

### Pattern 2: Mutation with Toast

```typescript
'use client';

import { useStartFlow } from '@/hooks';
import { showToast } from '@/lib/toast';

export default function FlowButton() {
  const startFlow = useStartFlow();

  const handleClick = async () => {
    try {
      const result = await startFlow.mutateAsync('content-creation');
      showToast.success('Flow started!');
      // Navigate or do something with result
    } catch (error) {
      showToast.error('Failed to start flow');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={startFlow.isPending}
      className="px-6 py-2 bg-black text-white rounded-lg"
    >
      {startFlow.isPending ? 'Starting...' : 'Start Flow'}
    </button>
  );
}
```

### Pattern 3: Search

```typescript
'use client';

import { useState } from 'react';
import { useSearchTools } from '@/hooks';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  
  // Only searches when query > 2 chars
  const { data, isLoading } = useSearchTools(query, query.length > 2);

  return (
    <div className="p-8">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tools..."
        className="w-full px-4 py-2 border rounded-lg"
      />
      
      {isLoading && <div className="mt-4">Searching...</div>}
      
      <div className="mt-6 space-y-4">
        {data?.data?.tools?.map((tool) => (
          <div key={tool.id} className="p-4 border rounded-lg">
            {tool.name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🎨 Styling

### CSS Variables (Available in light/dark mode)

```css
var(--background)        /* Page background */
var(--foreground)        /* Text color */
var(--surface)           /* Card backgrounds */
var(--surface-elevated)  /* Elevated surfaces */
var(--muted)             /* Muted text */
var(--border)            /* Borders */
```

### Common Tailwind Patterns

```typescript
// Container
<div className="container mx-auto px-4 py-8">

// Card
<div className="bg-white dark:bg-black border rounded-lg p-6">

// Button
<button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flex
<div className="flex items-center justify-between gap-4">
```

---

## 📝 API Response Structure

All APIs return this format:

```typescript
{
  success: true,
  data: {
    // Your data here
  }
}

// Access it:
data?.data?.yourField
```

---

## 🔑 Hook Return Values

### Queries (useTools, useFlows, etc.)
```typescript
{
  data,           // Response data
  isLoading,      // Initial loading
  isFetching,     // Background refetch
  error,          // Error object
  refetch,        // Manual refetch function
}
```

### Mutations (useStartFlow, useSubmitAnswer, etc.)
```typescript
{
  mutate,         // Trigger mutation (fire and forget)
  mutateAsync,    // Trigger mutation (returns promise)
  isPending,      // Is mutation running?
  isSuccess,      // Did it succeed?
  isError,        // Did it fail?
  data,           // Response data
  error,          // Error object
}
```

---

## ⚙️ What's Already Set Up

✅ **Providers** - QueryProvider, ToastProvider, ThemeProvider  
✅ **Axios** - Base URL, interceptors, error handling  
✅ **React Query** - Caching, loading states, refetching  
✅ **Dark Mode** - Theme toggle with system preference  
✅ **Auth** - Clerk integration  
✅ **TypeScript** - Full type safety  

---

## 🚀 Quick Start

1. **Create a page**: `src/app/your-page/page.tsx`
2. **Add `'use client'`** at the top (if using hooks)
3. **Import hooks**: `import { useTools } from '@/hooks'`
4. **Use the hook**: `const { data, isLoading } = useTools()`
5. **Render**: Handle loading, error, and data states

---

## 💡 Pro Tips

1. **Always use `'use client'`** for components with hooks
2. **Check `isLoading`** before accessing data
3. **Use `data?.data?.field`** for safe access
4. **Show loading states** for better UX
5. **Use toast for feedback** on mutations
6. **Check React Query DevTools** (bottom-right in dev mode)

---

## 🐛 Common Issues

**"Cannot use hooks in server component"**  
→ Add `'use client'` at the top

**"Data is undefined"**  
→ Check `isLoading` first, use `data?.data?.field`

**"API not working"**  
→ Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:4000/api`

---

## 📚 Quick Reference

### Imports
```typescript
import { useTools, useFlows, useStartFlow } from '@/hooks';
import { showToast } from '@/lib/toast';
import type { Tool } from '@/types/tool';
```

### Environment Variables
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Commands
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm lint         # Run linter
```

---

**That's it! You're ready to build. Start with `src/app/your-page/page.tsx`** 🚀
