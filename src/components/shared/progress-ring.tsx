"use client";

import { cn } from "@/lib/utils";

interface ProgressRingProps {
  percentage: number;
  strokeWidth?: number;
  size?: number;
  colorClass?: string; // Tailwind color class e.g., "stroke-primary"
  className?: string;
}

export function ProgressRing({
  percentage,
  strokeWidth = 3,
  size = 128, // equivalent to w-32 h-32
  colorClass = "stroke-primary",
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="stroke-border/50"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          className={cn("progress-ring__circle", colorClass)}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{percentage}%</span>
      </div>
    </div>
  );
}
