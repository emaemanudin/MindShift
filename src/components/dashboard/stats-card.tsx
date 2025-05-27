
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  iconElement: ReactNode; // Changed from icon: LucideIcon
  iconBgClass?: string;
  // iconColorClass is removed as color is applied when creating the iconElement
}

export function StatsCard({
  title,
  value,
  iconElement,
  iconBgClass = "bg-primary/10",
}: StatsCardProps) {
  return (
    <Card className="shadow-md">
      <CardContent className="p-6 flex items-center">
        <div className={cn("p-3 rounded-full mr-4", iconBgClass)}>
          {iconElement} {/* Render the passed icon element */}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
