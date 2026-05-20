import { useState, useRef, useCallback } from "react";
import { runSort } from "../api/algorithms";
import type { SortResponse, SortStep } from "../api/algorithms";

interface PlaybackState {
  steps: SortStep[];
  currentIndex: number;
  isPlaying: boolean;
  speed: number; // ms per step
  stats: { comparisons: number; swaps: number } | null;
}

const DEFAULT_SPEED = 400;

export function useAlgorithm() {
  const [state, setState] = useState<PlaybackState>({
    steps: [],
    currentIndex: 0,
    isPlaying: false,
    speed: DEFAULT_SPEED,
    stats: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStep = state.steps[state.currentIndex] ?? null;

  // Fetch all steps from the API for a given algorithm + array
  const load = useCallback(async (algorithm: string, array: number[]) => {
    setLoading(true);
    setError(null);
    clearTimer();
    try {
      const result: SortResponse = await runSort(algorithm, array);
      setState({
        steps: result.steps,
        currentIndex: 0,
        isPlaying: false,
        speed: DEFAULT_SPEED,
        stats: {
          comparisons: result.total_comparisons,
          swaps: result.total_swaps,
        },
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Advance one step forward
  const stepForward = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, prev.steps.length - 1),
    }));
  }, []);

  // Go one step back
  const stepBack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(prev.currentIndex - 1, 0),
    }));
  }, []);

  // Auto-play: advance a step every `speed` ms
  const play = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: true }));

    const tick = () => {
      setState((prev) => {
        const next = prev.currentIndex + 1;
        if (next >= prev.steps.length) {
          return { ...prev, isPlaying: false };
        }
        timerRef.current = setTimeout(tick, prev.speed);
        return { ...prev, currentIndex: next };
      });
    };

    timerRef.current = setTimeout(tick, state.speed);
  }, [state.speed]);

  const pause = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setState((prev) => ({ ...prev, currentIndex: 0, isPlaying: false }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState((prev) => ({ ...prev, speed }));
  }, []);

  return {
    currentStep,
    currentIndex: state.currentIndex,
    totalSteps: state.steps.length,
    isPlaying: state.isPlaying,
    speed: state.speed,
    stats: state.stats,
    loading,
    error,
    load,
    play,
    pause,
    reset,
    stepForward,
    stepBack,
    setSpeed,
  };
}
