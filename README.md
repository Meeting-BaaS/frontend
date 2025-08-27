<p align="center"><a href="https://discord.com/invite/dsvFgDTr6c"><img height="60px" src="https://user-images.githubusercontent.com/31022056/158916278-4504b838-7ecb-4ab9-a900-7dc002aade78.png" alt="Join our Discord!"></a></p>

# Meeting BaaS Analytics

A comprehensive analytics dashboard built with Next.js to monitor and analyze meeting bot performance across multiple platforms.

## Meeting BaaS Analytics Overview

Meeting BaaS Analytics is a powerful dashboard that provides detailed insights into your meeting bot performance. The platform offers:

- **Real-time Performance Monitoring**: Track bot success rates, error rates, and performance metrics across Zoom, Google Meet, and Microsoft Teams
- **Advanced Analytics**: Detailed analysis of meeting durations, error distributions, and platform-specific metrics
- **Interactive Visualizations**: Beautiful and responsive charts for data visualization
- **Customizable Filters**: Filter data by date range, platform, error type, and more
- **Error Analysis**: Comprehensive insights into error patterns and trends
- **Duration Analytics**: Comprehensive analysis of meeting durations and patterns

## Tech Stack

- **Framework**: Next.js 15.3.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn
- **Charts**: Recharts with D3
- **Authentication**: Centralised Auth app integration
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js (LTS version)
- pnpm 10.6.5 or later

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Meeting-Baas/analytics meeting-baas-analytics
   cd meeting-baas-analytics
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

## Design System Documentation

### ShadCN Components Usage

We use ShadCN UI components throughout the application:

```tsx
// Core components we use frequently
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  RadioGroup,
  RadioGroupItem,
  Badge,
  Label,
  AlertDialog,
} from "@/components/ui";
```

### Layout Patterns

#### Page Structure

- Header with title and description
- Tabbed interface for different analytics views
- Content sections with clear visual hierarchy

#### Component Patterns

- Analytics cards with consistent styling
- Interactive charts with tooltips
- Filter controls for data manipulation

### Common Element Styling

```tsx
// Tab styling with animated underline
<TabsTrigger
  className="flex-1 flex items-center justify-center gap-2 relative group"
  style={{ minHeight: "40px" }}
>
  <div className={`w-2 h-2 ${colorVariable} rounded-full`}></div>
  <span>{label}</span>
  <div className="absolute bottom-0 left-0 w-full h-0.5 scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-300 ease-in-out"
       style={{ backgroundColor: colorVariable }}></div>
</TabsTrigger>

// Analytics cards
<div className="p-6 bg-gradient-to-r from-muted/30 to-background rounded-lg border border-border/70 shadow-sm">
  {/* Content */}
</div>
```

### State Management / Data Fetching Pattern

```tsx
const [loading, setLoading] = useState(true);
const [data, setData] = useState<DataType>({});

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const apiData = await apiFunction(USER_TOKEN);
      setData(apiData);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
```

### Notification System

We use Sonner toast for notifications:

```tsx
// Success notification
toast.success("Action completed successfully");

// Error notification
toast.error("Failed to complete action");
```

### API Integration

The analytics API provides comprehensive data for visualization:

```tsx
// Example API function in your analytics-api.ts
export async function getAnalyticsData(
  userToken: string
): Promise<AnalyticsData> {
  try {
    return await axios({
      method: "GET",
      url: `/api/analytics/data`,
      headers: { Authorization: userToken },
    }).data;
  } catch (error) {
    console.error("[API] Error:", error);
    throw error;
  }
}
```
