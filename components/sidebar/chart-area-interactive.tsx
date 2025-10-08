"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Activity,
  Download,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const description = "Premium Revenue and Enrollment Analytics";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
  enrollments: {
    label: "Enrollments",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("30d");
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [metrics, setMetrics] = React.useState({
    totalRevenue: 0,
    totalEnrollments: 0,
    avgRevenue: 0,
    avgEnrollments: 0,
    revenueChange: 0,
    enrollmentChange: 0,
  });

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Fetch real data from API
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
        const data = await response.json();
        setChartData(data.chartData || []);
        setMetrics(data.metrics || {
          totalRevenue: 0,
          totalEnrollments: 0,
          avgRevenue: 0,
          avgEnrollments: 0,
          revenueChange: 0,
          enrollmentChange: 0,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
        // Fallback to sample data
        generateSampleData();
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  // Generate sample data for demo
  const generateSampleData = () => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const data = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      return {
        date: date.toISOString().split("T")[0],
        revenue: Math.floor(Math.random() * 3000) + 2000,
        enrollments: Math.floor(Math.random() * 50) + 30,
      };
    });
    setChartData(data);
    
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalEnrollments = data.reduce((sum, item) => sum + item.enrollments, 0);
    setMetrics({
      totalRevenue,
      totalEnrollments,
      avgRevenue: Math.round(totalRevenue / days),
      avgEnrollments: Math.round(totalEnrollments / days),
      revenueChange: 12.5,
      enrollmentChange: 8.3,
    });
  };

  const handleExport = () => {
    // Export chart data as CSV
    const csv = [
      ["Date", "Revenue", "Enrollments"],
      ...chartData.map(item => [item.date, item.revenue, item.enrollments])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${timeRange}.csv`;
    a.click();
  };

  return (
    <Card className="@container/card shadow-xl border-border/50 overflow-hidden">
      {/* Premium Header with Gradient */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <CardHeader className="space-y-4 pb-4 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Activity className="size-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Total Visitors
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span className="hidden @[540px]/card:block">
                    Total for the last 3 months
                  </span>
                  <span className="@[540px]/card:hidden">Last 3 months</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    Live
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </div>

          {/* Time Range Controls */}
          <CardAction className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="hidden md:flex gap-2"
            >
              <Download className="size-3.5" />
              Export
            </Button>
            
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
              <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
              <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            </ToggleGroup>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select time range"
              >
                <SelectValue placeholder="Last 30 days" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </div>

        {/* Premium Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Revenue Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-4 text-primary" />
                  <p className="text-xs font-medium text-muted-foreground">Total Revenue</p>
                </div>
                <p className="text-3xl font-bold text-primary">
                  ${metrics.totalRevenue.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Avg: ${metrics.avgRevenue.toLocaleString()}/day</span>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <TrendingUp className="size-3 text-green-500" />
                <span className="text-xs font-semibold text-green-500">
                  +{metrics.revenueChange}%
                </span>
              </div>
            </div>
          </div>

          {/* Enrollments Card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-chart-2/10 to-chart-2/5 border border-chart-2/20">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-chart-2" />
                  <p className="text-xs font-medium text-muted-foreground">Total Enrollments</p>
                </div>
                <p className="text-3xl font-bold" style={{ color: "hsl(var(--chart-2))" }}>
                  {metrics.totalEnrollments.toLocaleString()}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Avg: {metrics.avgEnrollments}/day</span>
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <TrendingUp className="size-3 text-green-500" />
                <span className="text-xs font-semibold text-green-500">
                  +{metrics.enrollmentChange}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading analytics...</p>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <AreaChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
              }}
            >
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillEnrollments" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-enrollments)"
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-enrollments)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid 
                vertical={false} 
                strokeDasharray="3 3" 
                opacity={0.3}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${value}`}
                className="text-xs"
              />
              <ChartTooltip
                cursor={{ strokeDasharray: "3 3", stroke: "hsl(var(--primary))" }}
                content={
                  <ChartTooltipContent
                    className="min-w-[200px]"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                    formatter={(value, name) => {
                      if (name === "revenue") {
                        return [`$${Number(value).toLocaleString()}`, "Revenue"];
                      }
                      return [value, "Enrollments"];
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="monotone"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
              />
              <Area
                dataKey="enrollments"
                type="monotone"
                fill="url(#fillEnrollments)"
                stroke="var(--color-enrollments)"
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
              />
            </AreaChart>
          </ChartContainer>
        )}

        {/* Enhanced Legend */}
        <div className="flex items-center justify-between pt-6 px-2">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-primary shadow-lg shadow-primary/50" />
              <span className="text-muted-foreground font-medium">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full shadow-lg" style={{ 
                backgroundColor: "hsl(var(--chart-2))",
                boxShadow: "0 4px 12px hsl(var(--chart-2) / 0.5)"
              }} />
              <span className="text-muted-foreground font-medium">Enrollments</span>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" className="gap-2">
            <Maximize2 className="size-3.5" />
            <span className="hidden md:inline">Fullscreen</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
