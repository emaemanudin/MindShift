"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { usePomodoro, type PomodoroMode } from "@/hooks/use-pomodoro";
import { cn } from "@/lib/utils";

export function PomodoroTimer() {
  const {
    mode,
    formattedTime,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    changeMode,
    isMounted,
  } = usePomodoro();

  if (!isMounted) {
    // Render a placeholder or skeleton while not mounted to avoid hydration mismatch
    return (
      <Card className="lg:col-span-1 shadow-md gradient-bg-timer text-primary-foreground animate-pulse">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Study Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-5xl font-bold mb-2">25:00</div>
            <p className="text-sm opacity-80">Pomodoro Session</p>
          </div>
          <div className="flex justify-center space-x-2 mb-6">
            <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-24" disabled><Play className="mr-2 h-4 w-4" /> Start</Button>
            <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-24" disabled><Pause className="mr-2 h-4 w-4" /> Pause</Button>
            <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-24" disabled><RotateCcw className="mr-2 h-4 w-4" /> Reset</Button>
          </div>
          <div className="flex justify-between text-sm">
            <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground opacity-70 w-1/3" disabled>Pomodoro</Button>
            <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground opacity-70 w-1/3" disabled>Short Break</Button>
            <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-white/20 hover:text-primary-foreground opacity-70 w-1/3" disabled>Long Break</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const modeText: Record<PomodoroMode, string> = {
    pomodoro: "Pomodoro Session",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  };
  
  const modeButtons: { id: PomodoroMode; label: string }[] = [
    { id: "pomodoro", label: "Pomodoro" },
    { id: "shortBreak", label: "Short Break" },
    { id: "longBreak", label: "Long Break" },
  ];

  return (
    <Card className="lg:col-span-1 shadow-md gradient-bg-timer text-primary-foreground">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Study Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-5xl font-bold mb-2" id="timerDisplay">
            {formattedTime}
          </div>
          <p className="text-sm opacity-80">{modeText[mode]}</p>
        </div>
        <div className="flex justify-center space-x-2 mb-6">
          <Button
            onClick={startTimer}
            disabled={isRunning}
            variant="secondary"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-24"
          >
            <Play className="mr-2 h-4 w-4" /> Start
          </Button>
          <Button
            onClick={pauseTimer}
            disabled={!isRunning}
            variant="secondary"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-24"
          >
            <Pause className="mr-2 h-4 w-4" /> Pause
          </Button>
          <Button 
            onClick={resetTimer}
            variant="secondary"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-24"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
        <div className="flex justify-between text-sm gap-2">
          {modeButtons.map(btn => (
            <Button
              key={btn.id}
              onClick={() => changeMode(btn.id)}
              size="sm"
              variant="ghost"
              className={cn(
                "text-primary-foreground hover:bg-white/20 hover:text-primary-foreground flex-1",
                mode === btn.id ? "bg-white/30 opacity-100 font-semibold" : "opacity-70"
              )}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
