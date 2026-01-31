import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  variant?: "default" | "success" | "warning" | "destructive" | "primary";
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: "bg-muted",
    iconColor: "text-foreground",
    valueColor: "text-foreground",
  },
  success: {
    iconBg: "bg-success-light",
    iconColor: "text-success",
    valueColor: "text-success",
  },
  warning: {
    iconBg: "bg-warning-light",
    iconColor: "text-warning",
    valueColor: "text-warning",
  },
  destructive: {
    iconBg: "bg-destructive-light",
    iconColor: "text-destructive",
    valueColor: "text-destructive",
  },
  primary: {
    iconBg: "bg-primary-light",
    iconColor: "text-primary",
    valueColor: "text-primary",
  },
};

export default function StatCardV2({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  variant = "default",
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card className={cn("shadow-md hover:shadow-lg transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>

            <div className="flex items-baseline gap-2">
              <p className={cn("text-3xl font-bold", styles.valueColor)}>
                {value}
              </p>

              {trend && (
                <span
                  className={cn(
                    "text-sm font-medium",
                    trend.isPositive ? "text-success" : "text-destructive"
                  )}
                >
                  {trend.isPositive ? "↑" : "↓"} {trend.value}%
                </span>
              )}
            </div>

            {subtitle && (
              <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
            )}
          </div>

          <div className={cn("p-3 rounded-xl", styles.iconBg)}>
            <Icon className={cn("w-6 h-6", styles.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
