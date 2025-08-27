<p align="center"><a href="https://discord.com/invite/dsvFgDTr6c"><img height="60px" src="https://user-images.githubusercontent.com/31022056/158916278-4504b838-7ecb-4ab9-a900-7dc002aade78.png" alt="Join our Discord!"></a></p>

# Meeting BaaS Settings

## ShadCN UI Charts

Beautiful, responsive charts built using Recharts. Easily integrate with your Meeting BaaS application.

### Introduction

ShadCN Charts is a collection of chart components that you can copy and paste into your apps. The charts are designed to look great out of the box, work well with other components, and are fully customizable to fit your project.

### Installation

```bash
# Install chart components
pnpm dlx shadcn@latest add chart
```

Add the following colors to your CSS file:

```css
@layer base {
  :root {
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}
```

### Complete List of Available Charts

ShadCN UI provides a rich collection of chart types and variations:

#### Area Charts

1. **Standard Area Chart** - Basic area visualization
2. **Area Chart - Linear** - Area chart with linear interpolation
3. **Area Chart - Step** - Area chart with step-like transitions
4. **Area Chart - Stacked** - Multiple area layers stacked together
5. **Area Chart - Stacked Expanded** - Stacked areas showing proportional distribution
6. **Area Chart - Legend** - Area chart with legend included
7. **Area Chart - Icons** - Area chart with icons in the legend
8. **Area Chart - Gradient** - Area chart with gradient fill
9. **Area Chart - Axes** - Area chart with custom axes configuration
10. **Area Chart - Interactive** - Area chart with enhanced interaction capabilities

#### Bar Charts

1. **Standard Bar Chart** - Basic vertical bar chart
2. **Bar Chart - Horizontal** - Bars displayed horizontally
3. **Bar Chart - Multiple** - Multiple series of bars grouped together
4. **Bar Chart - Label** - Bars with value labels
5. **Bar Chart - Custom Label** - Bars with customized labels
6. **Bar Chart - Mixed** - Combined bar types in a single chart
7. **Bar Chart - Stacked + Legend** - Stacked bars with legend
8. **Bar Chart - Active** - Bars with active state highlighting
9. **Bar Chart - Negative** - Bars displaying negative values
10. **Bar Chart - Interactive** - Bar chart with enhanced interaction capabilities

#### Line Charts

1. **Standard Line Chart** - Basic line chart visualization
2. **Line Chart - Linear** - Line chart with linear interpolation
3. **Line Chart - Step** - Line chart with step-like transitions
4. **Line Chart - Multiple** - Multiple lines on the same chart
5. **Line Chart - Dots** - Line chart with data points marked
6. **Line Chart - Custom Dots** - Line chart with customized data point markers
7. **Line Chart - Dots Colors** - Line chart with colored data points
8. **Line Chart - Label** - Line chart with value labels
9. **Line Chart - Custom Label** - Line chart with customized labels
10. **Line Chart - Interactive** - Line chart with enhanced interaction capabilities

#### Pie Charts

1. **Standard Pie Chart** - Basic pie chart visualization
2. **Pie Chart - Separator None** - Pie chart without separators between sections
3. **Pie Chart - Label** - Pie chart with value labels
4. **Pie Chart - Custom Label** - Pie chart with customized labels
5. **Pie Chart - Label List** - Pie chart with detailed label list
6. **Pie Chart - Legend** - Pie chart with legend
7. **Pie Chart - Donut** - Donut-style pie chart
8. **Pie Chart - Donut Active** - Donut chart with active state highlighting
9. **Pie Chart - Donut with Text** - Donut chart with text in the center
10. **Pie Chart - Stacked** - Pie chart with stacked sections
11. **Pie Chart - Interactive** - Pie chart with enhanced interaction capabilities

#### Radar Charts

1. **Standard Radar Chart** - Basic radar/spider chart
2. **Radar Chart - Dots** - Radar chart with data points marked
3. **Radar Chart - Multiple** - Multiple datasets on the same radar chart
4. **Radar Chart - Lines Only** - Radar chart showing only connecting lines
5. **Radar Chart - Custom Label** - Radar chart with customized labels
6. **Radar Chart - Radius Axis** - Radar chart with custom radius axis
7. **Radar Chart - Grid Custom** - Radar chart with custom grid styling
8. **Radar Chart - Grid Filled** - Radar chart with filled grid areas
9. **Radar Chart - Grid None** - Radar chart without grid lines
10. **Radar Chart - Grid Circle** - Radar chart with circular grid
11. **Radar Chart - Grid Circle - No lines** - Circular grid without connecting lines
12. **Radar Chart - Grid Circle Filled** - Circular grid with filled areas
13. **Radar Chart - Legend** - Radar chart with legend
14. **Radar Chart - Icons** - Radar chart with icons in the legend

#### Radial Charts

1. **Standard Radial Chart** - Basic radial/circular gauge chart
2. **Radial Chart - Label** - Radial chart with labels
3. **Radial Chart - Grid** - Radial chart with grid marks
4. **Radial Chart - Text** - Radial chart with text in the center
5. **Radial Chart - Shape** - Radial chart with custom shape
6. **Radial Chart - Stacked** - Multiple radial charts stacked together

#### Tooltip Components

1. **Tooltip - Default** - Standard tooltip with ChartTooltipContent
2. **Tooltip - Line Indicator** - Tooltip with line indicator
3. **Tooltip - No Indicator** - Tooltip without indicator
4. **Tooltip - Custom label** - Tooltip with custom label from chartConfig
5. **Tooltip - Label Formatter** - Tooltip with label formatter
6. **Tooltip - No Label** - Tooltip without label
7. **Tooltip - Formatter** - Tooltip with custom formatter
8. **Tooltip - Icons** - Tooltip with icons
9. **Tooltip - Advanced** - Tooltip with custom formatter and total

### Available Chart Types

ShadCN UI provides various chart types that can be used to visualize data:

#### Area Charts

- Standard Area Chart
- Stacked Area Chart
- Linear Area Chart
- Step Area Chart
- Gradient Area Chart
- Area Chart with Legend
- Area Chart with Axes
- Interactive Area Chart

#### Bar Charts

- Standard Bar Chart
- Horizontal Bar Chart
- Multiple Bar Chart
- Stacked Bar Chart
- Bar Chart with Labels
- Bar Chart with Custom Labels
- Mixed Bar Chart
- Interactive Bar Chart
- Negative Bar Chart

#### Line Charts

- Standard Line Chart
- Linear Line Chart
- Step Line Chart
- Multiple Line Chart
- Line Chart with Dots
- Line Chart with Custom Dots
- Line Chart with Labels
- Interactive Line Chart

#### Pie Charts

- Standard Pie Chart
- Donut Chart
- Donut Chart with Text
- Pie Chart with Labels
- Pie Chart with Custom Labels
- Pie Chart with Legend
- Interactive Pie Chart
- Stacked Pie Chart

#### Radar Charts

- Standard Radar Chart
- Radar Chart with Dots
- Multiple Radar Chart
- Radar Chart with Custom Labels
- Radar Chart with Grid Customization
- Radar Chart with Legend
- Radar Chart with Icons

#### Radial Charts

- Standard Radial Chart
- Radial Chart with Labels
- Radial Chart with Grid
- Radial Chart with Text
- Radial Chart with Custom Shapes
- Stacked Radial Chart

### Basic Usage

Here's a simple example of how to use ShadCN Charts:

```tsx
"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AnalyticsChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
```

### Chart Configuration

The chart config is where you define the labels, icons, and colors for a chart:

```tsx
import { Monitor, Smartphone } from "lucide-react";
import { type ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: Monitor,
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    icon: Smartphone,
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
```

### Tooltip Customization

You can customize tooltips using the `ChartTooltip` and `ChartTooltipContent` components:

```tsx
<ChartTooltip
  content={
    <ChartTooltipContent
      labelKey="visitors"
      nameKey="browser"
      indicator="line"
      hideLabel={false}
    />
  }
/>
```

### Legend Customization

Add legends to your chart with `ChartLegend` and `ChartLegendContent` components:

```tsx
<ChartLegend content={<ChartLegendContent nameKey="browser" />} />
```

### Accessibility

Enable keyboard access and screen reader support for your charts:

```tsx
<LineChart accessibilityLayer />
```

### Integration with Meeting BaaS

ShadCN Charts can be used to visualize Meeting BaaS analytics data, such as:

- Meeting attendance over time
- User engagement metrics
- API usage statistics
- Transcript analysis visualizations
- Bot interaction summaries

For implementation examples, refer to the Meeting BaaS analytics documentation or explore the example components in the codebase.
