import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Activity {
  id: string;
  description: string;
  timestamp: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconColorClass: string;
  actionIcon?: LucideIcon;
  actionIconColorClass?: string;
}

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  const Icon = activity.icon;
  const ActionIcon = activity.actionIcon;

  return (
    <div className="flex items-start p-3 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className={cn("p-2 rounded-full mr-4", activity.iconBgClass)}>
        <Icon className={cn("h-5 w-5", activity.iconColorClass)} />
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-sm text-foreground">{activity.description}</h4>
        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
      </div>
      {ActionIcon && (
        <div className={cn("ml-2", activity.actionIconColorClass || "text-muted-foreground")}>
          <ActionIcon className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}

