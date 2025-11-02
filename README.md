# Draftbox AI

A web-based AI Design Agent that helps users with design-related tasks. Generate images, layouts, and visual designs from text descriptions using AI image models.

## 🚀 Features

- **Text-to-Image Generation**: Enter a text description and generate images or layouts using AI image models
- **Customizable Generation**: Influence outputs with options like style, color palette, or format
- **Iterative Design**: Generate multiple variations, regenerate, or refine results with new prompts
- **Moodboard Creation**: Generate moodboards for design inspiration

## 🏗️ Architecture

This is a monorepo project using:
- **pnpm workspaces** for package management
- **Turbo** for build orchestration
- **TypeScript** throughout

### Apps

- **`apps/server`**: Backend API server built with [Hono](https://hono.dev/)
- **`apps/web`**: Frontend React application built with [Vite](https://vitejs.dev/)

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** v10.20.0 (or higher)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd draftbox-ai
```

2. Install dependencies:
```bash
pnpm install
```

## 🏃 Development

Run all apps in development mode:
```bash
pnpm dev
```

This will start:
- **Server** at `http://localhost:3001`
- **Web app** at `http://localhost:5173` (default Vite port)

### Individual App Commands

#### Server
```bash
cd apps/server
pnpm dev        # Run development server
pnpm build      # Build for production
pnpm start      # Run production build
pnpm typecheck  # Type check without emitting
```

#### Web
```bash
cd apps/web
pnpm dev        # Run development server
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm lint       # Run linter
```

## 🏗️ Building

Build all apps:
```bash
pnpm build
```

## ✅ Type Checking

Type check all apps:
```bash
pnpm typecheck
```

## 🔍 Linting

Lint all apps:
```bash
pnpm lint
```

## 📁 Project Structure

```
draftbox-ai/
├── apps/
│   ├── server/          # Backend API server
│   │   ├── src/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/             # Frontend React app
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── vite.config.ts
├── packages/            # Shared packages (if any)
├── package.json         # Root package.json
├── pnpm-workspace.yaml  # pnpm workspace config
└── turbo.json           # Turbo build config
```

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Backend**: Hono, Node.js, TypeScript
- **Build Tool**: Turbo
- **Package Manager**: pnpm

## 📝 License

ISC
