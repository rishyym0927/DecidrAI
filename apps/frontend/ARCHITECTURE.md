# Simplified Frontend Architecture Guide

## 🎯 Overview

The frontend has been completely simplified using modern best practices:

- **Axios** for API calls (replacing custom fetch client)
- **TanStack Query (React Query)** for state management and caching
- **React Hot Toast** for notifications
- **Centralized configuration** for easier maintenance

---

## 📦 New Packages Added

```json
{
  "axios": "^1.13.2",
  "@tanstack/react-query": "^5.90.12",
  "@tanstack/react-query-devtools": "^5.91.1",
  "react-hot-toast": "^2.6.0"
}
```

---

## 🏗️ Architecture Overview

### 1. **API Layer** (`src/lib/`)

#### Axios Instance (`src/lib/axios.ts`)
- Centralized axios configuration
- Automatic auth token injection
- Global error handling
- Request/response interceptors

```typescript
import api from '@/lib/axios';

// All API calls use this instance
const response = await api.get('/tools');
```

#### API Modules (`src/lib/api/`)
- `tools.ts` - Tool service endpoints
- `flows.ts` - Flow service endpoints
- `recommendations.ts` - Recommendation endpoints
- `comparisons.ts` - Comparison endpoints
- `index.ts` - Centralized exports

**Example:**
```typescript
import { getTools, searchTools } from '@/lib/api';

const tools = await getTools({ category: 'Design' });
const results = await searchTools('image generation');
```

---

### 2. **React Query Hooks** (`src/hooks/`)

Pre-built hooks for all API operations with automatic:
- ✅ Loading states
- ✅ Error handling
- ✅ Caching
- ✅ Refetching
- ✅ Optimistic updates

#### Available Hooks:

**Tools** (`useTools.ts`):
```typescript
import { useTools, useTool, useSearchTools } from '@/hooks';

// Get all tools
const { data, isLoading, error } = useTools({ category: 'Design' });

// Get single tool
const { data: tool } = useTool('chatgpt');

// Search tools
const { data: results } = useSearchTools('image generation');
```

**Flows** (`useFlows.ts`):
```typescript
import { 
  useFlows, 
  useFlow, 
  useStartFlow, 
  useSubmitAnswer 
} from '@/hooks';

// Get all flows
const { data: flows } = useFlows();

// Start a flow (mutation)
const startFlow = useStartFlow();
await startFlow.mutateAsync('content-creation');

// Submit answer
const submitAnswer = useSubmitAnswer();
await submitAnswer.mutateAsync({ 
  sessionId: 'xxx', 
  answer: 'Blog posts' 
});
```

**Recommendations** (`useRecommendations.ts`):
```typescript
import { 
  useRecommendationsBySession, 
  useGetRecommendations 
} from '@/hooks';

// Get recommendations by session
const { data } = useRecommendationsBySession(sessionId);

// Get recommendations by tags
const getRecommendations = useGetRecommendations();
await getRecommendations.mutateAsync({ 
  tags: ['design', 'ai'], 
  limit: 5 
});
```

**Comparisons** (`useComparisons.ts`):
```typescript
import { 
  useCompareTools, 
  usePopularComparisons 
} from '@/hooks';

// Compare tools
const { data } = useCompareTools(['chatgpt', 'claude']);

// Get popular comparisons
const { data: popular } = usePopularComparisons();
```

---

### 3. **Providers** (`src/providers/`)

#### QueryProvider
Wraps the app with React Query functionality:
- Automatic caching (1 minute stale time)
- Dev tools in development mode
- Retry logic (1 retry)

#### ToastProvider
Global toast notifications with theme support.

---

### 4. **Toast Notifications** (`src/lib/toast.ts`)

Simple utility for showing notifications:

```typescript
import { showToast } from '@/lib/toast';

// Success
showToast.success('Tool saved successfully!');

// Error
showToast.error('Failed to load tools');

// Loading
const toastId = showToast.loading('Saving...');
showToast.dismiss(toastId);

// Promise-based
showToast.promise(
  saveToolAsync(),
  {
    loading: 'Saving...',
    success: 'Saved!',
    error: 'Failed to save',
  }
);
```

---

## 🚀 Usage Examples

### Example 1: Simple Data Fetching

```typescript
'use client';

import { useTools } from '@/hooks';

export default function ToolsList() {
  const { data, isLoading, error } = useTools({ limit: 10 });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data?.tools?.map(tool => (
        <div key={tool.id}>{tool.name}</div>
      ))}
    </div>
  );
}
```

### Example 2: Mutations with Toast

```typescript
'use client';

import { useStartFlow } from '@/hooks';
import { showToast } from '@/lib/toast';

export default function StartFlowButton() {
  const startFlow = useStartFlow();

  const handleStart = async () => {
    try {
      const session = await startFlow.mutateAsync('content-creation');
      showToast.success('Flow started!');
      // Navigate to flow page...
    } catch (error) {
      showToast.error('Failed to start flow');
    }
  };

  return (
    <button 
      onClick={handleStart}
      disabled={startFlow.isPending}
    >
      {startFlow.isPending ? 'Starting...' : 'Start Flow'}
    </button>
  );
}
```

### Example 3: Search with Debouncing

```typescript
'use client';

import { useState } from 'react';
import { useSearchTools } from '@/hooks';
import { useDebounce } from '@/hooks/useDebounce'; // You'll need to create this

export default function ToolSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  
  const { data, isLoading } = useSearchTools(
    debouncedQuery,
    debouncedQuery.length > 2
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tools..."
      />
      {isLoading && <div>Searching...</div>}
      {data?.data?.tools?.map(tool => (
        <div key={tool.id}>{tool.name}</div>
      ))}
    </div>
  );
}
```

---

## 🎨 Benefits of This Architecture

### Before (Custom Fetch Client):
```typescript
// Manual error handling
const response = await apiClient.get('/tools');
if (!response.success) {
  console.error(response.error);
  return;
}
const tools = response.data;

// No loading states
// No caching
// Manual state management
```

### After (React Query + Axios):
```typescript
// Automatic everything!
const { data, isLoading, error } = useTools();

// ✅ Loading state: isLoading
// ✅ Error handling: error
// ✅ Caching: automatic
// ✅ Refetching: automatic
// ✅ Type safety: full TypeScript support
```

---

## 📊 React Query DevTools

In development mode, you'll see a floating React Query icon in the bottom-right corner. Click it to:
- View all queries and their states
- See cached data
- Manually trigger refetches
- Debug query issues

---

## 🔧 Configuration

### Axios Configuration (`src/lib/axios.ts`)
- Base URL: `process.env.NEXT_PUBLIC_API_URL`
- Timeout: 10 seconds
- Auto-retry: Handled by React Query

### React Query Configuration (`src/providers/QueryProvider.tsx`)
- Stale time: 1 minute
- Refetch on window focus: Disabled
- Retry: 1 attempt

---

## 📝 Migration Guide

### Old Way:
```typescript
import { getTools } from '@/lib/api/tools';

const [tools, setTools] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchTools = async () => {
    setLoading(true);
    const response = await getTools();
    if (response.success) {
      setTools(response.data);
    }
    setLoading(false);
  };
  fetchTools();
}, []);
```

### New Way:
```typescript
import { useTools } from '@/hooks';

const { data: tools, isLoading } = useTools();
// That's it! 🎉
```

---

## 🎯 Next Steps

1. **Remove old client.ts**: The old fetch-based client is no longer needed
2. **Create more hooks**: Add hooks for any new API endpoints
3. **Add optimistic updates**: For better UX on mutations
4. **Implement infinite queries**: For pagination
5. **Add error boundaries**: For better error handling

---

## 📚 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Axios Docs](https://axios-http.com/)
- [React Hot Toast Docs](https://react-hot-toast.com/)

---

**Built with ❤️ for a simpler, more maintainable frontend**
