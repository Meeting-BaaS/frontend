<p align="center"><a href="https://discord.com/invite/dsvFgDTr6c"><img height="60px" src="https://user-images.githubusercontent.com/31022056/158916278-4504b838-7ecb-4ab9-a900-7dc002aade78.png" alt="Join our Discord!"></a></p>

# Meeting BaaS Settings

A simple settings interface built with Next.js to handle user settings and email preferences.

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
   git clone https://github.com/Meeting-Baas/settings
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

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Authentication Integration

This project is pre-configured to integrate with the authentication app. Ensure the authentication service is running and properly configured. Update the `.env` file with the required environment variables for authentication.

## Email Preferences

The settings app includes a comprehensive email preferences management system that allows users to:

- Control email subscriptions by service category (Reports, Announcements, Developer Updates, Account)
- Set frequency preferences (daily, weekly, monthly) for each type of email
- Unsubscribe from individual emails or entire service categories at once
- Resend the latest email of any type

### Email Preference Types

The application uses a centralized type system for email preferences defined in `lib/email-types.ts`:

```typescript
// Available email frequency options
export type EmailFrequency = "daily" | "weekly" | "monthly" | "none";

// Available service/domain categories
export type EmailDomain =
  | "reports"
  | "announcements"
  | "developers"
  | "account";

// Email type definition as stored in the database
export interface EmailType {
  id: string; // Unique identifier
  name: string; // Display name
  description: string; // Description text
  domain: EmailDomain; // Service category
  frequencies: EmailFrequency[]; // Available frequencies
  required?: boolean; // If true, can't be unsubscribed
}
```


### Unsubscribe Links

When sending emails to users, you can include unsubscribe links in the following format:

```
https://settings.meetingbaas.com/email-preferences?unsubscribe=EMAIL_TYPE_ID
```

Where:

- `EMAIL_TYPE_ID` is the identifier for the specific email type (e.g., `product-updates`, `meeting-summaries`)

#### Example Unsubscribe URLs:

For individual email types:

```
https://settings.meetingbaas.com/email-preferences?unsubscribe=product-updates
```

When a user clicks an unsubscribe link:

1. They'll be directed to the email preferences page
2. If not logged in, they'll be prompted to authenticate
3. Upon authentication, they'll see a confirmation dialog
4. After confirmation, the preference will be updated and a success message displayed

### Email Type IDs

The following email type IDs are available for unsubscribe links:

| ID                          | Name                      | Service Category  | Required |
| --------------------------- | ------------------------- | ----------------- | -------- |
| `usage-reports`             | Usage Reports             | Reports           | No       |
| `product-updates`           | Product Updates           | Announcements     | No       |
| `maintenance-notifications` | Maintenance Notifications | Announcements     | No       |
| `company-news`              | Company News              | Announcements     | No       |
| `api-changes`               | API Changes               | Developer Updates | No       |
| `developer-resources`       | Developer Resources       | Developer Updates | No       |
| `security-alerts`           | Security Alerts           | Account           | Yes      |
| `billing-notifications`     | Billing Notifications     | Account           | Yes      |
