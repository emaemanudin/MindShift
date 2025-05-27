"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  fallbackInitials?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  aiHint?: string;
}

export function UserAvatar({
  src,
  alt = "User Avatar",
  fallbackInitials = "SN",
  size = "md",
  className,
  aiHint,
}: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
          height={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
          className="object-cover"
          data-ai-hint={aiHint}
        />
      ) : (
         <AvatarImage src={src || undefined} alt={alt} data-ai-hint={aiHint} />
      )}
      <AvatarFallback className={sizeClasses[size]}>
        {fallbackInitials ? fallbackInitials : <User className="h-1/2 w-1/2" />}
      </AvatarFallback>
    </Avatar>
  );
}
