# Frontend Pages Structure

Complete list of all pages in the DecidrAI frontend application.

---

## 📄 Public Pages

### Homepage
- **Path**: `/`
- **File**: `src/app/page.tsx`
- **Purpose**: Main landing page with hero, features, and CTA
- **Hooks**: None (static content)

### Tools Directory
- **Path**: `/tools`
- **File**: `src/app/tools/page.tsx`
- **Purpose**: Browse all AI tools with filters and search
- **Hooks**: `useTools()`
- **Features**: Filters, search, pagination

### Tool Detail
- **Path**: `/tools/[slug]`
- **File**: `src/app/tools/[slug]/page.tsx`
- **Purpose**: Individual tool page with full details
- **Hooks**: `useTool(slug)`, `useRelatedTools(slug)`
- **Features**: Tool details, related tools, comparison option

### Discovery Flows Listing
- **Path**: `/discover`
- **File**: `src/app/discover/page.tsx`
- **Purpose**: Browse all available discovery flows
- **Hooks**: `useFlows()`
- **Features**: Flow cards with descriptions

### Flow Detail
- **Path**: `/discover/[slug]`
- **File**: `src/app/discover/[slug]/page.tsx`
- **Purpose**: Flow details and start button
- **Hooks**: `useFlow(slug)`, `useStartFlow()`
- **Features**: Flow info, sample questions, start flow

### Flow Session (Questionnaire)
- **Path**: `/discover/[slug]/session/[sessionId]`
- **File**: `src/app/discover/[slug]/session/[sessionId]/page.tsx`
- **Purpose**: Interactive questionnaire
- **Hooks**: `useFlowSession(sessionId)`, `useSubmitAnswer()`, `useCompleteFlow()`
- **Features**: Progress bar, question rendering, answer submission

### Flow Results
- **Path**: `/discover/[slug]/results/[sessionId]`
- **File**: `src/app/discover/[slug]/results/[sessionId]/page.tsx`
- **Purpose**: Personalized recommendations after flow completion
- **Hooks**: `useRecommendationsBySession(sessionId)`
- **Features**: Recommended tools, extracted tags, save results

### Tool Comparison
- **Path**: `/compare`
- **File**: `src/app/compare/page.tsx`
- **Purpose**: Side-by-side tool comparison
- **Hooks**: `useCompareTools(slugs)`, `usePopularComparisons()`
- **Features**: Tool selector, comparison table, AI summary

### Categories
- **Path**: `/categories`
- **File**: `src/app/categories/page.tsx`
- **Purpose**: Browse tools by category
- **Hooks**: None (static categories)
- **Features**: Category grid

### Category Detail
- **Path**: `/categories/[slug]`
- **File**: `src/app/categories/[slug]/page.tsx`
- **Purpose**: Tools in a specific category
- **Hooks**: `useTools({ category: slug })`
- **Features**: Filtered tools, category info

### Search
- **Path**: `/search`
- **File**: `src/app/search/page.tsx`
- **Purpose**: Global search across all tools
- **Hooks**: `useSearchTools(query)`
- **Features**: Search input, results with match scores

### About
- **Path**: `/about`
- **File**: `src/app/about/page.tsx`
- **Purpose**: Information about DecidrAI
- **Hooks**: None (static content)
- **Features**: Mission, how it works, features

---

## 🔐 Protected Pages (Require Auth)

### User Profile
- **Path**: `/profile`
- **File**: `src/app/profile/page.tsx`
- **Purpose**: User's saved tools and flow history
- **Hooks**: Custom user hooks (to be created)
- **Features**: Saved tools, flow history, preferences

---

## 🛡️ Admin Pages (Require Admin Role)

### Admin Dashboard
- **Path**: `/admin`
- **File**: `src/app/admin/page.tsx`
- **Purpose**: Admin overview with stats
- **Hooks**: Custom analytics hooks (to be created)
- **Features**: Stats cards, recent activity

### Admin Tools Management
- **Path**: `/admin/tools`
- **File**: `src/app/admin/tools/page.tsx`
- **Purpose**: Manage all tools (CRUD)
- **Hooks**: `useTools()`
- **Features**: Tools table, search, pagination, CRUD actions

### Admin Tool Create
- **Path**: `/admin/tools/new`
- **File**: `src/app/admin/tools/new/page.tsx`
- **Purpose**: Create new tool
- **Hooks**: Custom mutation hook (to be created)
- **Features**: Comprehensive form with all tool fields

### Admin Tool Edit
- **Path**: `/admin/tools/[id]/edit`
- **File**: `src/app/admin/tools/[id]/edit/page.tsx`
- **Purpose**: Edit existing tool
- **Hooks**: `useTool(id)`, custom mutation hook
- **Features**: Pre-filled form, update functionality

### Admin Flows Management
- **Path**: `/admin/flows`
- **File**: `src/app/admin/flows/page.tsx`
- **Purpose**: Manage all flows (CRUD)
- **Hooks**: `useFlows()`
- **Features**: Flows table, search, CRUD actions

### Admin Flow Create
- **Path**: `/admin/flows/new`
- **File**: `src/app/admin/flows/new/page.tsx`
- **Purpose**: Create new flow
- **Hooks**: Custom mutation hook (to be created)
- **Features**: Flow builder with question editor

### Admin Flow Edit
- **Path**: `/admin/flows/[id]/edit`
- **File**: `src/app/admin/flows/[id]/edit/page.tsx`
- **Purpose**: Edit existing flow
- **Hooks**: `useFlow(id)`, custom mutation hook
- **Features**: Pre-filled flow builder

---

## 📊 Page Summary

| Type | Count | Description |
|------|-------|-------------|
| **Public** | 11 | Accessible to all users |
| **Protected** | 1 | Requires authentication |
| **Admin** | 7 | Requires admin role |
| **Total** | **19** | All pages |

---

## 🗺️ Site Map

```
/                                    # Homepage
├── /tools                          # Tools directory
│   └── /tools/[slug]              # Tool detail
├── /discover                       # Discovery flows
│   └── /discover/[slug]           # Flow detail
│       └── /session/[sessionId]   # Flow questionnaire
│           └── /results/[sessionId] # Flow results
├── /compare                        # Tool comparison
├── /categories                     # Categories
│   └── /categories/[slug]         # Category detail
├── /search                         # Global search
├── /about                          # About page
├── /profile                        # User profile (protected)
└── /admin                          # Admin section (admin only)
    ├── /admin/tools               # Tools management
    │   ├── /admin/tools/new       # Create tool
    │   └── /admin/tools/[id]/edit # Edit tool
    └── /admin/flows               # Flows management
        ├── /admin/flows/new       # Create flow
        └── /admin/flows/[id]/edit # Edit flow
```

---

## 🔌 API Endpoints Used

### Tools
- `GET /api/tools` - List all tools
- `GET /api/tools/search` - Search tools
- `GET /api/tools/:slug` - Get tool details
- `GET /api/tools/:slug/related` - Get related tools
- `POST /api/admin/tools` - Create tool (admin)
- `PATCH /api/admin/tools/:id` - Update tool (admin)
- `DELETE /api/admin/tools/:id` - Delete tool (admin)

### Flows
- `GET /api/flows` - List all flows
- `GET /api/flows/:slug` - Get flow details
- `POST /api/flows/:slug/start` - Start flow session
- `POST /api/flows/sessions/:sessionId/answer` - Submit answer
- `GET /api/flows/sessions/:sessionId` - Get session status
- `POST /api/flows/sessions/:sessionId/complete` - Complete flow
- `POST /api/admin/flows` - Create flow (admin)
- `PATCH /api/admin/flows/:id` - Update flow (admin)
- `DELETE /api/admin/flows/:id` - Delete flow (admin)

### Recommendations
- `POST /api/recommend` - Get recommendations by tags
- `GET /api/recommend/session/:sessionId` - Get session recommendations

### Comparisons
- `GET /api/compare?tools=slug1,slug2` - Compare tools
- `POST /api/compare` - Regenerate comparison
- `GET /api/compare/popular` - Get popular comparisons

### Auth
- `GET /api/auth/me` - Get current user (protected)

---

## 🎯 Next Steps

1. **Implement page content** - Fill in the blank structures with actual UI
2. **Add authentication guards** - Protect routes that require auth
3. **Create admin middleware** - Verify admin role for admin pages
4. **Add loading skeletons** - Better UX during data fetching
5. **Implement error boundaries** - Graceful error handling
6. **Add SEO metadata** - Page titles, descriptions, OG tags
7. **Create reusable components** - Extract common UI patterns

---

**All page structures are ready for development!** 🚀
