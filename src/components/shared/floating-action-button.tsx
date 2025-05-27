import { Button, type ButtonProps } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps extends ButtonProps {
  icon?: React.ReactNode;
}

export function FloatingActionButton({ icon, className, ...props }: FloatingActionButtonProps) {
  return (
    <Button
      size="icon"
      className={cn(
        "fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg z-40",
        className
      )}
      {...props}
    >
      {icon || <Plus className="h-6 w-6" />}
    </Button>
  );
}
