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
│   ├── frontend/          # Next.js web application
│   └── api-gateway/       # Main entry point for backend services
├── services/              # Microservices
│   ├── auth/              # Authentication service
│   ├── flow/              # Recommendation flow logic
│   └── ...
├── packages/              # Shared libraries
│   ├── db/                # Database schemas and connection
│   ├── logger/            # Shared logging utility
│   └── types/             # Shared TypeScript types
```

## ⚡ Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   PNPM (`npm install -g pnpm`)
*   MongoDB & Redis (locally or via URIs)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-org/DecidrAI.git
    cd DecidrAI
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    *   Copy `.env.example` to `.env` in respective apps/services (if applicable).
    *   Ensure database connections are set.

### Running the App

To run the entire stack in development mode:

```bash
pnpm dev
```

This will start all applications and services in parallel using Turbo.

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the ISC License.
