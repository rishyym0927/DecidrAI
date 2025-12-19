# Frontend Quick Reference

## 📦 Import Cheat Sheet

```typescript
// Hooks (most common)
import { useTools, useTool, useSearchTools } from '@/hooks';
import { useFlows, useStartFlow, useSubmitAnswer } from '@/hooks';
import { useRecommendationsBySession } from '@/hooks';
import { useCompareTools } from '@/hooks';

// Toast notifications
import { showToast } from '@/lib/toast';

// API functions (if you need direct calls)
import { getTools, searchTools } from '@/lib/api';

// Types
import type { Tool, ToolFilters } from '@/types/tool';
import type { Flow } from '@/types/flow';
```

---

## 🪝 Hooks Quick Reference

### Tools
```typescript
// List all tools
const { data, isLoading, error } = useTools({ category: 'Design', limit: 10 });

// Single tool
const { data: tool } = useTool('chatgpt');

// Search
const { data: results } = useSearchTools('query');

// Related tools
const { data: related } = useRelatedTools('chatgpt');
```

### Flows
```typescript
// List flows
const { data: flows } = useFlows();

// Single flow
const { data: flow } = useFlow('content-creation');

// Start flow (mutation)
const startFlow = useStartFlow();
await startFlow.mutateAsync('flow-slug');

// Submit answer (mutation)
const submitAnswer = useSubmitAnswer();
await submitAnswer.mutateAsync({ sessionId: 'xxx', answer: 'value' });

// Complete flow (mutation)
const completeFlow = useCompleteFlow();
await completeFlow.mutateAsync('session-id');
```

### Recommendations
```typescript
// By session
const { data } = useRecommendationsBySession('session-id');

// By tags (mutation)
const getRecommendations = useGetRecommendations();
await getRecommendations.mutateAsync({ tags: ['ai', 'design'], limit: 5 });
```

### Comparisons
```typescript
// Compare tools
const { data } = useCompareTools(['chatgpt', 'claude']);

// Popular comparisons
const { data: popular } = usePopularComparisons();

// Regenerate (mutation)
const regenerate = useRegenerateComparison();
await regenerate.mutateAsync(['chatgpt', 'claude']);
```

---

## 🔔 Toast Quick Reference

```typescript
import { showToast } from '@/lib/toast';

showToast.success('Success message');
showToast.error('Error message');
const id = showToast.loading('Loading...');
showToast.dismiss(id);

// Promise-based
showToast.promise(
  asyncFunction(),
  { loading: 'Loading...', success: 'Done!', error: 'Failed!' }
);
```

---

## 🎨 Styling Quick Reference

### CSS Variables
```css
var(--background)
var(--foreground)
var(--surface)
var(--surface-elevated)
var(--muted)
var(--border)
var(--toast-bg)
var(--toast-color)
var(--toast-border)
```

### Common Tailwind Patterns
```typescript
// Container
<div className="container mx-auto px-4 py-8">

// Card
<div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6">

// Button
<button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flex
<div className="flex items-center justify-between gap-4">
```

---

## 📝 Common Patterns

### Loading State
```typescript
if (isLoading) return <div className="p-8">Loading...</div>;
if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;
```

### Mutation with Toast
```typescript
const mutation = useSomeMutation();

const handleAction = async () => {
  try {
    await mutation.mutateAsync(data);
    showToast.success('Success!');
  } catch (error) {
    showToast.error('Failed!');
  }
};
```

### Conditional Rendering
```typescript
{data?.data?.items?.map(item => (
  <div key={item.id}>{item.name}</div>
))}
```

---

## 🔑 Environment Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

## 🚀 Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linter
```

---

## 📂 File Locations

| What | Where |
|------|-------|
| New page | `src/app/your-page/page.tsx` |
| New component | `src/components/your-component.tsx` |
| New hook | `src/hooks/useYourHook.ts` |
| Types | `src/types/your-type.ts` |
| Utilities | `src/lib/your-util.ts` |

---

## 🎯 Response Structure

All API responses follow this structure:

```typescript
{
  success: true,
  data: {
    // Your data here
  }
}

// Or on error:
{
  success: false,
  error: "Error message",
  message: "Detailed message"
}
```

Access data: `data?.data?.yourField`

---

## 🐛 Debugging

1. **React Query DevTools**: Check bottom-right corner in dev mode
2. **Console**: Check browser console for errors
3. **Network**: Check Network tab for API calls
4. **Types**: Hover over variables to see types

---

**Keep this open while building!** 📌
