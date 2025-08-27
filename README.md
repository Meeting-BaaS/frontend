<p align="center"><a href="https://discord.com/invite/dsvFgDTr6c"><img height="60px" src="https://user-images.githubusercontent.com/31022056/158916278-4504b838-7ecb-4ab9-a900-7dc002aade78.png" alt="Join our Discord!"></a></p>

# Pricing App

A modern, feature-rich pricing interface built with Next.js for managing and displaying product pricing with advanced features, and customization options.

## Features

- 📋 Custom pricing tiers and plans
- 📱 Responsive design for all devices
- 🌓 Dark/Light mode support

## Tech Stack

- **Framework**: Next.js 15.3.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**:
  - Radix UI primitives
  - Shadcn components
  - Custom components
- **Data Management**:
  - TanStack Table (React Table v8)
  - TanStack Query
- **Date Handling**: Day.js
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js (LTS version)
- pnpm 10.8.1 or later

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Meeting-Baas/pricing
   cd pricing
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

### Code Formatting and Linting

This project uses Biome for code formatting and linting. To ensure consistent code style:

1. Install the Biome VS Code extension
2. Configure VS Code to use Biome as the default formatter:
   - Open VS Code settings
   - Search for "Default Formatter"
   - Select "Biome" as the default formatter
   - Enable "Format On Save" for automatic formatting

#### Semantic Color Naming

Tailwind v4 encourages using semantic color naming for better theme support and accessibility. Instead of using specific color names, use background/foreground pairs:

```css
@layer base {
  :root {
    /* Light theme */
    --background: #ffffff;
    --foreground: #000000;
    
    /* Component-specific colors */
    --card-background: #f8f9fa;
    --card-foreground: #1a1a1a;
    
    /* Interactive elements */
    --primary-background: #0070f3;
    --primary-foreground: #ffffff;
  }
  
  .dark {
    /* Dark theme */
    --background: #000000;
    --foreground: #ffffff;
    
    --card-background: #1a1a1a;
    --card-foreground: #f8f9fa;
    
    --primary-background: #0070f3;
    --primary-foreground: #ffffff;
  }
}
```

Usage in components:
```tsx
<div className="bg-background text-foreground">
  <div className="bg-card-background text-card-foreground">
    Card content
  </div>
  <button className="bg-primary-background text-primary-foreground">
    Click me
  </button>
</div>
```

This approach makes it easier to:
- Switch between light and dark themes
- Maintain consistent contrast ratios
- Update the color scheme globally
- Support different color modes (like high contrast)

### Building for Production

To build the application for production:

```bash
pnpm build
```

You can then start the production server:

```bash
pnpm start
```

For deployment to hosting platforms like Vercel or Netlify, refer to their respective documentation for Next.js deployments.

## Project Structure

```text
├── app/                    # Next.js app directory
│   ├── (protected)/        # Protected pages  
│   │   └── billing/        # Billing page
│   ├── (public)/           # Public pages
├── components/             # React components
│   ├── pricing-table/      # Main pricing table components
│   ├── ui/                 # Reusable UI components
│   └── ...
├── contexts/               # React contexts
├── lib/                    # Utility functions and helpers
│   ├── api.ts              # API client functions
│   ├── utils.ts            # Utility functions
│   └── ...
├── public/                 # Static assets
└── next.config.ts          # Proxy for API routes and image host configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add error reporting dialog'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

