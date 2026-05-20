import { useState } from "react";
import { useAlgorithm } from "./hooks/useAlgorithm";
import { SortVisualizer } from "./components/Visualizer/SortVisualizer";
import { Controls } from "./components/Controls/Controls";
import "./App.css";

const DEFAULT_ARRAY = [5, 3, 8, 1, 9, 2, 7, 4, 6];

function randomArray(size = 12): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
}

export default function App() {
  const [inputValue, setInputValue] = useState(DEFAULT_ARRAY.join(", "));
  const [algorithm, setAlgorithm] = useState("bubble");

  const {
    currentStep,
    currentIndex,
    totalSteps,
    isPlaying,
    speed,
    stats,
    loading,
    error,
    load,
    play,
    pause,
    reset,
    stepForward,
    stepBack,
    setSpeed,
  } = useAlgorithm();

  const handleRun = () => {
    const arr = inputValue
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !isNaN(n));

    if (arr.length < 2) {
      alert("Enter at least 2 numbers");
      return;
    }
    load(algorithm, arr);
  };

  const handleRandom = () => {
    const arr = randomArray();
    setInputValue(arr.join(", "));
    load(algorithm, arr);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>DSA Visualizer</h1>
        <p>Learn algorithms by watching them run</p>
      </header>

      <main className="app-main">
        {/* Input row */}
        <div className="input-row">
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="bubble">Bubble sort</option>
            <option value="merge">Merge sort</option>
            <option value="quick">Quick sort</option>
          </select>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g. 5, 3, 8, 1, 9"
          />
          <button onClick={handleRun} disabled={loading} className="btn-primary">
            {loading ? "Loading…" : "Run"}
          </button>
          <button onClick={handleRandom} disabled={loading}>
            Random
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Visualizer */}
        <SortVisualizer step={currentStep} />

        {/* Controls */}
        {totalSteps > 0 && (
          <Controls
            isPlaying={isPlaying}
            currentIndex={currentIndex}
            totalSteps={totalSteps}
            speed={speed}
            onPlay={play}
            onPause={pause}
            onReset={reset}
            onStepForward={stepForward}
            onStepBack={stepBack}
            onSpeedChange={setSpeed}
          />
        )}

        {/* Stats */}
        {stats && (
          <div className="stats">
            <span>Comparisons: <strong>{stats.comparisons}</strong></span>
            <span>Swaps: <strong>{stats.swaps}</strong></span>
          </div>
        )}
      </main>
    </div>
  );
}
