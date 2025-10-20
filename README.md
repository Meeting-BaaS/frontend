<p align="center"><a href="https://discord.com/invite/dsvFgDTr6c"><img height="60px" src="https://user-images.githubusercontent.com/31022056/158916278-4504b838-7ecb-4ab9-a900-7dc002aade78.png" alt="Join our Discord!"></a></p>

# Meeting BaaS Frontend Monorepo

A modern, scalable frontend monorepo built with **Turborepo** and **pnpm workspaces**, containing multiple Next.js applications and shared packages for the Meeting BaaS platform.

## 🚀 What's Inside?

This monorepo contains the following applications and packages:

### Applications

- **`apps/auth`** - Authentication system with user management and session handling
- **`apps/analytics`** - Comprehensive analytics dashboard for meeting bot performance
- **`apps/logs`** - Debug logs and system metrics viewer
- **`apps/settings`** - Application settings and configuration management
- **`apps/pricing`** - Pricing tiers and billing management interface
- **`apps/viewer`** - Content viewing and presentation application

### Packages

- **`packages/shared`** - Shared UI components, hooks, and utilities used across all apps

## 🛠️ Prerequisites

- **Node.js** (LTS version)
- **pnpm** 10.8.1 or later

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Meeting-BaaS/frontend
cd frontend

# Install all dependencies
pnpm install
```

## 🚀 Available Commands

### Development

```bash
# Start all applications in development mode
pnpm dev

# Start a specific application
pnpm dev --filter=auth
pnpm dev --filter=analytics
pnpm dev --filter=logs
pnpm dev --filter=settings
pnpm dev --filter=pricing
pnpm dev --filter=viewer
```

### Building

```bash
# Build all applications
pnpm build

# Build a specific application
pnpm build:app auth
pnpm build:app analytics
pnpm build:app logs
pnpm build:app settings
pnpm build:app pricing
pnpm build:app viewer
```

### Production

```bash
# Start all applications in production mode
pnpm start

# Start a specific application in production mode
pnpm start:app auth
pnpm start:app analytics
pnpm start:app logs
pnpm start:app settings
pnpm start:app pricing
pnpm start:app viewer
```

### Code Quality

```bash
# Lint all code
pnpm lint

# Check TypeScript types
pnpm check-types

# Format code
pnpm format

# Check formatting
pnpm format:check

# Run all checks (lint + format + types)
pnpm check
```

## 🏗️ Project Structure

```text
frontend/
├── apps/                    # Next.js applications
│   ├── auth/               # Authentication system
│   ├── analytics/          # Analytics dashboard
│   ├── logs/               # Debug logs viewer
│   ├── settings/           # Settings management
│   ├── pricing/            # Pricing interface
│   └── viewer/             # Content viewer
├── packages/                # Shared packages
│   └── shared/             # Shared UI components and utilities
├── package.json            # Root package configuration
├── turbo.json              # Turborepo configuration
├── pnpm-workspace.yaml     # pnpm workspace configuration
├── biome.json              # Biome linting and formatting config
└── tsconfig.json           # TypeScript configuration
```

## 📚 Shared Packages

### `@repo/shared` Package

The shared package contains reusable components, hooks, and utilities that are consumed by all applications. This approach eliminates the need to duplicate dependencies across individual apps, making maintenance easier and ensuring consistency.

**Key exports:**

- **UI Components**: Shadcn components built on Radix UI primitives
- **Layout Components**: Common layout patterns and structures
- **Hooks**: Custom React hooks for common functionality
- **Utilities**: Helper functions and utilities
- **Animations**: Shared animation utilities
- **Auth Utilities**: Authentication-related utilities using better-auth

#### Adding New Shadcn Components

When you need to add a new Shadcn component to the shared package:

```bash
# Navigate to the shared package
cd packages/shared

# Add the component (e.g., card, button, etc.)
pnpm dlx shadcn@latest add card
```

The component will be automatically available to all applications through the `@repo/shared/components/ui/*` import path.

## 🎨 Development Tools

### Biome v2.2.2

This monorepo uses **Biome v2.2.2** for:

- **Linting**: Code quality and best practices enforcement
- **Formatting**: Consistent code style across all applications
- **Type Checking**: TypeScript validation

### Environment Configuration

Since environment configuration is shared across certain applications, a single `.env.example` file is maintained at the root level. This file is consumed by all apps for local development, ensuring consistent configuration management.

## 📱 Individual Application Details

For detailed information about each application, including features, tech stack, and specific setup instructions, please refer to their individual README files:

| Application   | Description                                | README                                     |
| ------------- | ------------------------------------------ | ------------------------------------------ |
| **Auth**      | Authentication system with user management | [📖 View README](apps/auth/README.md)      |
| **Analytics** | Meeting bot performance analytics          | [📖 View README](apps/analytics/README.md) |
| **Logs**      | Debug logs and system metrics              | [📖 View README](apps/logs/README.md)      |
| **Settings**  | App configuration management               | [📖 View README](apps/settings/README.md)  |
| **Pricing**   | Pricing tiers and billing                  | [📖 View README](apps/pricing/README.md)   |
| **Viewer**    | Content viewing interface                  | [📖 View README](apps/viewer/README.md)    |

## 🚀 Deployment

### Vercel (Recommended)

This monorepo is optimized for Vercel deployment. Vercel automatically detects the monorepo structure and provides options to deploy individual applications.

### Self-Hosted

For self-hosted deployments, use the provided scripts. Depending on your workflow, you might want to configure a **pnpm install** script to ensure that all dependencies are installed in your environment. Each application is configured to run on a specific port for reliable local development and deployment:

```bash
# Build and start a specific application
pnpm build:app auth        # Builds auth app
pnpm start:app auth        # Starts auth app on port 3002

pnpm build:app logs        # Builds logs app
pnpm start:app logs        # Starts logs app on port 3003

pnpm build:app settings    # Builds settings app
pnpm start:app settings    # Starts settings app on port 3004

pnpm build:app pricing     # Builds pricing app
pnpm start:app pricing     # Starts pricing app on port 3005

pnpm build:app analytics   # Builds analytics app
pnpm start:app analytics   # Starts analytics app on port 3007

pnpm build:app viewer      # Builds viewer app
pnpm start:app viewer      # Starts viewer app on port 3008

# Or build all and start all applications
pnpm build                 # Builds all applications
pnpm start                 # Starts all applications on their respective ports

# To filter multiple applications please use
pnpm build --filter=auth --filter=logs
pnpm start --filter=auth --filter=logs

```

**Note**: The port configuration is designed for local development and self-hosted deployments. For production environments, you can build on top of this setup using **nginx**, **HAProxy**, or other reverse proxy solutions to route traffic appropriately based on domain names or URL paths.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
