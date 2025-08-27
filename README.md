<p align="center"><a href="https://discord.com/invite/dsvFgDTr6c"><img height="60px" src="https://user-images.githubusercontent.com/31022056/158916278-4504b838-7ecb-4ab9-a900-7dc002aade78.png" alt="Join our Discord!"></a></p>

# Meeting BaaS Viewer

A video viewer interface built with Next.js to handle view meeting recordings, access and navigate through transcripts.

## Tech Stack

- **Framework**: Next.js 15.3.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn
- **Authentication**: Centralised Auth app integration
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js (LTS version)
- pnpm 10.6.5 or later

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Meeting-Baas/viewer
   cd viewer
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

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Authentication Integration

This project is pre-configured to integrate with the authentication app. Ensure the authentication service is running and properly configured. Update the `.env` file with the required environment variables for authentication.
