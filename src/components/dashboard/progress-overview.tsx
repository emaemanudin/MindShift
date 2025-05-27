"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/shared/progress-ring";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

interface ProgressData {
  overall: number;
  assignments: number;
  quizzes: number;
}

const initialProgressData: ProgressData = {
  overall: 0,
  assignments: 0,
  quizzes: 0,
};

// Mock data for different timeframes - in a real app, this would be fetched
const progressDataMap: Record<string, ProgressData> = {
  week: { overall: 75, assignments: 90, quizzes: 60 },
  month: { overall: 80, assignments: 85, quizzes: 70 },
  allTime: { overall: 85, assignments: 92, quizzes: 78 },
};


export function ProgressOverview() {
  const [mounted, setMounted] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("week");
  const [currentProgress, setCurrentProgress] = useState<ProgressData>(progressDataMap.week);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (mounted) {
      setCurrentProgress(progressDataMap[selectedTimeframe] || progressDataMap.week);
    }
  }, [selectedTimeframe, mounted]);


  if (!mounted) {
    // Skeleton or placeholder to avoid hydration mismatch
    return (
      <Card className="lg:col-span-2 shadow-md animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Your Progress</CardTitle>
          <div className="w-32 h-10 bg-muted rounded-md"></div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-32 h-32 bg-muted rounded-full mb-4"></div>
              <div className="w-20 h-4 bg-muted rounded"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="lg:col-span-2 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">Your Progress</CardTitle>
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="allTime">All Time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center">
          <ProgressRing percentage={currentProgress.overall} colorClass="stroke-primary" />
          <p className="mt-2 font-medium text-foreground">Overall</p>
        </div>
        <div className="flex flex-col items-center">
          <ProgressRing percentage={currentProgress.assignments} colorClass="stroke-green-500" />
          <p className="mt-2 font-medium text-foreground">Assignments</p>
        </div>
        <div className="flex flex-col items-center">
          <ProgressRing percentage={currentProgress.quizzes} colorClass="stroke-yellow-500" />
          <p className="mt-2 font-medium text-foreground">Quizzes</p>
        </div>
      </CardContent>
    </Card>
  );
}
