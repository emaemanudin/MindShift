
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { UserAvatar } from "@/components/shared/user-avatar";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { StudyGroup } from "@/lib/db/data-models";

// Props for the StudyGroupItem component
interface StudyGroupItemProps {
  groupData: Omit<StudyGroup, 'icon' | 'teacher' | 'messages'>; // Serializable data from adapter
  iconElement: ReactNode; // Icon as a ReactNode, passed from parent
  iconBgClass: string;
}

export function StudyGroupItem({ groupData, iconElement, iconBgClass }: StudyGroupItemProps) {
  const { name, description, members } = groupData;

  return (
    <div className="flex items-center p-3 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className={cn("p-2 rounded-full mr-4", iconBgClass)}>
        {iconElement}
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-foreground">{name}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex -space-x-2">
          {members.slice(0, 3).map((member) => (
            <UserAvatar 
              key={member.id} 
              src={member.avatarUrl} 
              alt={member.name} 
              size="sm" 
              className="border-2 border-background"
              aiHint={member.avatarAiHint}
            />
          ))}
          {members.length > 3 && (
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-muted-foreground text-xs border-2 border-background">
              +{members.length - 3}
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" aria-label="Group options">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Leave Group</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
