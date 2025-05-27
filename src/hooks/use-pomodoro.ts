"use client";

import { useState, useEffect, useCallback } from "react";

export type PomodoroMode = "pomodoro" | "shortBreak" | "longBreak";

const MODE_DURATIONS: Record<PomodoroMode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export function usePomodoro() {
  const [mode, setMode] = useState<PomodoroMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(MODE_DURATIONS.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensure this runs only on client
  }, []);


  useEffect(() => {
    if (!isRunning || !mounted) return;

    if (timeLeft <= 0) {
      setIsRunning(false);
      // Optionally: auto-switch mode or play sound
      // For now, just stops.
      alert(`${mode.charAt(0).toUpperCase() + mode.slice(1)} session complete!`);
      // Reset to current mode's duration or switch mode
      setTimeLeft(MODE_DURATIONS[mode]); 
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, timeLeft, mode, mounted]);

  const startTimer = useCallback(() => {
    if (mounted) setIsRunning(true);
  }, [mounted]);

  const pauseTimer = useCallback(() => {
    if (mounted) setIsRunning(false);
  }, [mounted]);

  const resetTimer = useCallback(() => {
    if (mounted) {
      setIsRunning(false);
      setTimeLeft(MODE_DURATIONS[mode]);
    }
  }, [mode, mounted]);

  const changeMode = useCallback((newMode: PomodoroMode) => {
    if (mounted) {
      setMode(newMode);
      setTimeLeft(MODE_DURATIONS[newMode]);
      setIsRunning(false); // Stop timer when mode changes
    }
  }, [mounted]);

  const formattedTime = `${String(Math.floor(timeLeft / 60)).padStart(
    2,
    "0"
  )}:${String(timeLeft % 60).padStart(2, "0")}`;

  return {
    mode,
    timeLeft,
    isRunning,
    formattedTime,
    startTimer,
    pauseTimer,
    resetTimer,
    changeMode,
    isMounted: mounted,
  };
}
