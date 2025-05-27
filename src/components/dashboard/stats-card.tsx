import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgClass?: string;
  iconColorClass?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconBgClass = "bg-primary/10",
  iconColorClass = "text-primary",
}: StatsCardProps) {
  return (
    <Card className="shadow-md">
      <CardContent className="p-6 flex items-center">
        <div className={cn("p-3 rounded-full mr-4", iconBgClass)}>
          <Icon className={cn("h-6 w-6", iconColorClass)} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
