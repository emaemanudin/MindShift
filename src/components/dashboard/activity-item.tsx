
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react"; // For Activity data interface
import { cn } from "@/lib/utils";

// Original Activity interface for data structure
export interface Activity {
  id: string;
  description: string;
  timestamp: string;
  icon: LucideIcon; // Main icon component type in data
  iconBgClass: string;
  iconColorClass: string;
  actionIcon?: LucideIcon; // Optional action icon component type in data
  actionIconColorClass?: string;
}

// Props for the ActivityItem component
interface ActivityItemProps {
  activityData: Omit<Activity, 'icon' | 'actionIcon' | 'iconBgClass' | 'iconColorClass' | 'actionIconColorClass'>; // Serializable data
  mainIconElement: ReactNode; // Main icon as a ReactNode
  actionIconElement?: ReactNode; // Optional action icon as a ReactNode
  iconBgClass: string;
  actionIconContainerClass?: string; // Class for the div wrapping actionIconElement
}

export function ActivityItem({ 
  activityData, 
  mainIconElement, 
  actionIconElement, 
  iconBgClass, 
  actionIconContainerClass 
}: ActivityItemProps) {
  const { description, timestamp } = activityData;

  return (
    <div className="flex items-start p-3 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className={cn("p-2 rounded-full mr-4", iconBgClass)}>
        {mainIconElement} {/* Render the main icon element */}
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-sm text-foreground">{description}</h4>
        <p className="text-xs text-muted-foreground">{timestamp}</p>
      </div>
      {actionIconElement && (
        <div className={cn(actionIconContainerClass)}> {/* Apply container class */}
          {actionIconElement} {/* Render the action icon element */}
        </div>
      )}
    </div>
  );
}
