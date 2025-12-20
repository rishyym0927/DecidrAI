# Auth Service

Authentication and user management microservice for the DecidrAI platform.

## Overview

The Auth Service handles all user-related operations including:
- User profile management
- Saved tools (bookmarks)
- AI Stack (personal tool collection)
- Interaction tracking
- Admin user management

It integrates with **Clerk** for authentication and uses **MongoDB** for data persistence.

## API Documentation

📚 **Swagger UI**: http://localhost:5002/api-docs

## Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Service health check |
| POST | `/webhooks/clerk` | Clerk webhook for user sync |

### Protected Endpoints (Require Auth)

#### Profile Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/me` | Get current user profile |
| PATCH | `/auth/me` | Update user profile |

#### Saved Tools
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/me/saved-tools` | Get saved tools list |
| POST | `/auth/me/saved-tools/:toolId` | Save a tool |
| DELETE | `/auth/me/saved-tools/:toolId` | Unsave a tool |

#### AI Stack
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/me/ai-stack` | Get AI stack |
| POST | `/auth/me/ai-stack` | Add tool to AI stack |
| DELETE | `/auth/me/ai-stack/:toolId` | Remove from AI stack |

#### Interactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/interactions` | Track user interaction |
| GET | `/auth/interactions` | Get user's interactions |

### Admin Endpoints (Require Admin Role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List all users (paginated) |
| GET | `/admin/users/:id` | Get user by ID |
| PATCH | `/admin/users/:id/role` | Update user role |
| GET | `/admin/analytics/users` | Get user analytics |

## Data Models

### User
```typescript
{
  clerkUserId: string;
  email?: string;
  name?: string;
  image?: string;
  role: "user" | "admin";
  profile: {
    bio?: string;
    experienceLevel?: "beginner" | "intermediate" | "advanced";
    interests?: string[];
  };
  savedTools: Array<{
    toolId: ObjectId;
    savedAt: Date;
    notes?: string;
  }>;
  aiStack: Array<{
    toolId: ObjectId;
    category: string;
    notes?: string;
    addedAt: Date;
  }>;
  preferences: {
    emailNotifications: boolean;
    theme: "light" | "dark" | "system";
  };
}
```

### Interaction
```typescript
{
  userId?: ObjectId;
  sessionId: string;
  eventType: "view" | "click" | "save" | "compare" | "flow_start" | "flow_complete";
  toolId?: ObjectId;
  flowId?: ObjectId;
  source?: string;
  metadata?: object;
  userAgent?: string;
  ipAddress?: string;
}
```

## Setup

### Environment Variables

```bash
# Required
PORT=5002
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=decidrai
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Project Structure

```
src/
├── controllers/
│   ├── admin.controller.ts    # Admin endpoint handlers
│   ├── interaction.controller.ts
│   └── user.controller.ts     # User endpoint handlers
├── models/
│   ├── Interaction.ts         # Interaction tracking model
│   └── User.ts                # Extended user model
├── routes/
│   ├── admin.routes.ts        # Admin routes
│   ├── auth.routes.ts         # User routes
│   └── clerkWebhook.ts        # Clerk webhook handler
├── services/
│   ├── interaction.service.ts # Interaction business logic
│   └── user.service.ts        # User business logic
├── index.ts                   # Entry point
└── swagger.ts                 # OpenAPI configuration
```

## Integration with API Gateway

All endpoints are proxied through the API Gateway:

```
API Gateway (port 5001)     →    Auth Service (port 5002)
─────────────────────────        ─────────────────────────
/api/auth/me               →     /auth/me
/api/auth/me/saved-tools   →     /auth/me/saved-tools
/api/admin/users           →     /admin/users
```

## Testing

Visit the Swagger UI at `/api-docs` to test all endpoints interactively.
