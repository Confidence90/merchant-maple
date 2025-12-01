// src/components/dashboard/RevenueChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueChartProps {
  revenueData: number;
}

// Données simulées basées sur le revenue total
function generateChartData(totalRevenue: number) {
  const baseData = [
    { name: "Lun", revenue: totalRevenue * 0.1 },
    { name: "Mar", revenue: totalRevenue * 0.15 },
    { name: "Mer", revenue: totalRevenue * 0.12 },
    { name: "Jeu", revenue: totalRevenue * 0.18 },
    { name: "Ven", revenue: totalRevenue * 0.22 },
    { name: "Sam", revenue: totalRevenue * 0.25 },
    { name: "Dim", revenue: totalRevenue * 0.18 },
  ];
  
  return baseData.map(item => ({
    ...item,
    revenue: Math.round(item.revenue)
  }));
}

export function RevenueChart({ revenueData }: RevenueChartProps) {
  const data = generateChartData(revenueData);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Revenus de la semaine (simulation)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value) => [`${value} XOF`, 'Revenue']}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}