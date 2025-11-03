
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Activity } from "@/lib/db/data-models";


// Props for the ActivityItem component
interface ActivityItemProps {
  activityData: Omit<Activity, 'icon' | 'actionIcon'>; // Serializable data
  mainIconElement: ReactNode; // Main icon as a ReactNode
  actionIconElement?: ReactNode; // Optional action icon as a ReactNode
  iconBgClass: string;
}

export function ActivityItem({ 
  activityData, 
  mainIconElement, 
  actionIconElement, 
  iconBgClass, 
}: ActivityItemProps) {
  const { description, timestamp } = activityData;

  return (
    <div className="flex items-start p-3 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className={cn("p-2 rounded-full mr-4", iconBgClass)}>
        {mainIconElement}
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-sm text-foreground">{description}</h4>
        <p className="text-xs text-muted-foreground">{timestamp}</p>
      </div>
      {actionIconElement && (
        <div className="ml-2 text-muted-foreground">
          {actionIconElement}
        </div>
      )}
    </div>
  );
}
