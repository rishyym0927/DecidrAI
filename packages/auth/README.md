# @decidrai/auth

Shared authentication utilities for DecidrAI services.

## Environment Variables

This package relies on environment variables being set by the consuming application. It does **not** load `.env` files itself.

Ensure the following variables are available in your service's environment:

- `CLERK_SECRET_KEY`: Required for validating Clerk session tokens.
- `SERVICE_SECRET`: Required for internal service-to-service authentication guards.

## Usage

### Session Validation

```typescript
import { validateClerkSession } from "@decidrai/auth";

const session = await validateClerkSession(token);
```

### Internal Service Guard

```typescript
import { requireInternalAuth } from "@decidrai/auth";

app.use("/internal", requireInternalAuth, internalRoutes);
```
