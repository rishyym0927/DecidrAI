# DecidrAI

**The "Google for AI Decisions"** - an intelligent, curated discovery platform that helps users choose the right AI tools quickly and confidently by focusing on intent-based recommendations rather than overwhelming directories.

## 🚀 Features

*   **Intent-Based Discovery Flows**: Guided questionnaires to understand user needs and recommend the perfect tools.
*   **Curated Tool Directory**: High-quality, manually verified database of AI tools.
*   **Intelligent Comparisons**: Side-by-side comparisons with AI-generated analysis.
*   **Transparent Monetization**: Ethical affiliate tracking with clear labeling.

## 🛠️ Tech Stack

*   **Monorepo**: [Turbo](https://turbo.build/) + [PNPM](https://pnpm.io/)
*   **Frontend**: Next.js 14, TailwindCSS, shadcn/ui
*   **Backend**: Node.js, Express, MongoDB, Redis
*   **Services**: Microservices architecture

## 📂 Project Structure

```
├── apps/
│   ├── frontend/          # Next.js 16 web application
│   └── api-gateway/       # Main entry point for backend services
├── services/              # Microservices
│   ├── auth-service/      # Authentication service (Clerk + MongoDB)
│   ├── flow-service/      # Recommendation flow logic
│   ├── analytics-service/ # User behavior tracking
│   └── ...
├── packages/              # Shared libraries
│   ├── db/                # Database schemas and connection
│   ├── logger/            # Shared logging utility
│   └── types/             # Shared TypeScript types
```

## ⚡ Getting Started

### Prerequisites

*   **Node.js** (LTS version recommended)
*   **PNPM** (`npm install -g pnpm`)
*   **Docker** (Optional, for running local DBs)

### External Services Setup

Before running the project, you need to set up the following accounts:

1.  **Clerk**: Create an account for authentication.
    *   Obtain your `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
    *   Create a **Webhook** pointing to your auth-service (e.g., via ngrok tunnel) for syncing user data. The endpoint is typically `/webhooks/clerk`.
    *   Get the `CLERK_WEBHOOK_SECRET`.
2.  **MongoDB**: Create an Atlas cluster or run locally.
    *   Get your connection URI (`MONGODB_URI`).
3.  **Redis**: Create an Upstash account or run locally.
    *   Get your connection details for caching.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rishyym0927/DecidrAI.git
    cd DecidrAI
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    *   Copy `.env.example` to `.env` in `apps/frontend/`, `services/auth-service/`, and other active services.
    *   Populate the keys obtained in the "External Services Setup" step.

    **Frontend (.env.local):**
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...

    ```

    **Auth Service (.env):**
    ```env
    PORT=5002
    MONGODB_URI=...
    CLERK_SECRET_KEY=...
    CLERK_WEBHOOK_SECRET=...
    ```

### Running the App

To run the entire stack in development mode:

```bash
pnpm dev
```

This will start all applications and services (Frontend, API Gateway, Auth Service, etc.) in parallel using Turbo.

### Webhook Development
To test Clerk webhooks locally:
1.  Run `pnpm dev`.
2.  Use **ngrok** to tunnel port `5002` (Auth Service): `ngrok http 5002`
3.  Add the ngrok URL to Clerk Dashboard Webhooks (e.g., `https://<your-ngrok-id>.ngrok-free.app/webhooks/clerk`).

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the ISC License.