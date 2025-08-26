<p align="center"><a href="https://discord.com/invite/dsvFgDTr6c"><img height="60px" src="https://user-images.githubusercontent.com/31022056/158916278-4504b838-7ecb-4ab9-a900-7dc002aade78.png" alt="Join our Discord!"></a></p>

# Meeting BaaS Auth

A modern authentication system built with Next.js, featuring secure user management, session handling, and email verification capabilities.

## Features

- 🔐 Secure authentication with session management
- 👤 User profile management
- 📱 Responsive design
- 🚀 Built with Next.js 15 and Turbopack
- 🎨 Modern UI with Tailwind CSS and Radix UI components

## Tech Stack

- **Framework**: Next.js 15.3.1
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS 4.1.3
- **UI Components**: Shadcn (Radix UI)
- **Authentication**: Better Auth
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js (LTS version)
- pnpm 10.6.5 or later
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd meeting-baas-auth
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in the required environment variables in `.env`. Details about the expected values for each key is documented in .env.example

4. Run database migrations:

   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

   This repo extends the existing accounts table but doesn't create it initially.
  
   When forking:
   1. Create an accounts table with the schema defined in `database/accounts-schema.ts`
   2. Run migrations to add related authentication tables

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `pnpm dev`: Start development server with Turbopack
- `pnpm build`: Build the application for production
- `pnpm start`: Start the production server
- `pnpm lint`: Run Biome linter
- `pnpm check-types`: Check TypeScript types

## Project Structure

```text
├── app/            # Next.js app directory
├── components/     # Reusable UI components
├── database/       # Database configuration and migrations
├── lib/            # Utility functions and shared logic
├── migrations/     # Database migration files
├── public/         # Static assets
└── styles/         # Global styles
```

## Authentication Flow

The application uses a secure authentication system with the following features:

- Session-based authentication
- OAuth authentication
- Secure cookie handling
- CORS protection for API routes

## Database Schema

The application uses the following main tables:

- `accounts`: User profiles and company information
- `sessions`: Active user sessions
- `provider_accounts`: Authentication provider accounts
- `verifications`: Email verification tokens

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
