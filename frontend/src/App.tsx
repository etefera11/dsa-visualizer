import { useState } from "react";
import { useAlgorithm } from "./hooks/useAlgorithm";
import { SortVisualizer } from "./components/Visualizer/SortVisualizer";
import { LinkedListVisualizer } from "./components/Visualizer/LinkedListVisualizer";
import { Controls } from "./components/Controls/Controls";
import { runLinkedList } from "./api/algorithms";
import type { LinkedListStep } from "./api/algorithms";
import "./App.css";

const DEFAULT_SORT_ARRAY = "5, 3, 8, 1, 9, 2, 7, 4, 6";
const DEFAULT_LL_VALUES = "10, 20, 30, 40, 50";

type Mode = "sorting" | "linked-list";

function randomArray(size = 12): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
}

export default function App() {
  const [mode, setMode] = useState<Mode>("sorting");

  // Sorting state
  const [sortInput, setSortInput] = useState(DEFAULT_SORT_ARRAY);
  const [algorithm, setAlgorithm] = useState("bubble");

  // Linked list state
  const [llInput, setLlInput] = useState(DEFAULT_LL_VALUES);
  const [llOperation, setLlOperation] = useState("traverse");
  const [llTarget, setLlTarget] = useState("");
  const [llSteps, setLlSteps] = useState<LinkedListStep[]>([]);
  const [llIndex, setLlIndex] = useState(0);
  const [llPlaying, setLlPlaying] = useState(false);
  const [llSpeed, setLlSpeed] = useState(400);
  const [llLoading, setLlLoading] = useState(false);
  const [llError, setLlError] = useState<string | null>(null);

  const llStep = llSteps[llIndex] ?? null;

  const {
    currentStep, currentIndex, totalSteps, isPlaying,
    speed, stats, loading, error,
    load, play, pause, reset, stepForward, stepBack, setSpeed,
  } = useAlgorithm();

  const handleSortRun = () => {
    const arr = sortInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    if (arr.length < 2) { alert("Enter at least 2 numbers"); return; }
    load(algorithm, arr);
  };

  const handleRandom = () => {
    const arr = randomArray();
    setSortInput(arr.join(", "));
    load(algorithm, arr);
  };

  const handleLLRun = async () => {
    const values = llInput.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    if (values.length < 1) { alert("Enter at least 1 value"); return; }

    const needsTarget = ["search", "insert", "delete"].includes(llOperation);
    const target = llTarget !== "" ? Number(llTarget) : undefined;
    if (needsTarget && target === undefined) {
      alert(`"${llOperation}" requires a target value`); return;
    }

    setLlLoading(true);
    setLlError(null);
    setLlPlaying(false);
    try {
      const result = await runLinkedList(llOperation, values, target);
      setLlSteps(result.steps);
      setLlIndex(0);
    } catch (e: unknown) {
      setLlError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLlLoading(false);
    }
  };

  // Simple LL playback (mirrors useAlgorithm but inline for brevity)
  const llPlay = () => {
    setLlPlaying(true);
    const tick = () => {
      setLlIndex(prev => {
        if (prev >= llSteps.length - 1) { setLlPlaying(false); return prev; }
        setTimeout(tick, llSpeed);
        return prev + 1;
      });
    };
    setTimeout(tick, llSpeed);
  };

  const needsTarget = ["search", "insert", "delete"].includes(llOperation);

  return (
    <div className="app">
      <header className="app-header">
        <h1>DSA Visualizer</h1>
        <p>Learn algorithms by watching them run</p>
      </header>

      {/* Mode tabs */}
      <div className="mode-tabs">
        <button
          className={mode === "sorting" ? "tab active" : "tab"}
          onClick={() => setMode("sorting")}
        >
          Sorting
        </button>
        <button
          className={mode === "linked-list" ? "tab active" : "tab"}
          onClick={() => setMode("linked-list")}
        >
          Linked List
        </button>
      </div>

      <main className="app-main">
        {mode === "sorting" && (
          <>
            <div className="input-row">
              <select value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
                <option value="bubble">Bubble sort</option>
                <option value="merge">Merge sort</option>
                <option value="quick">Quick sort</option>
              </select>
              <input
                type="text"
                value={sortInput}
                onChange={e => setSortInput(e.target.value)}
                placeholder="e.g. 5, 3, 8, 1, 9"
              />
              <button onClick={handleSortRun} disabled={loading} className="btn-primary">
                {loading ? "Loading…" : "Run"}
              </button>
              <button onClick={handleRandom} disabled={loading}>Random</button>
            </div>
            {error && <div className="error">{error}</div>}
            <SortVisualizer step={currentStep} />
            {totalSteps > 0 && (
              <Controls
                isPlaying={isPlaying} currentIndex={currentIndex}
                totalSteps={totalSteps} speed={speed}
                onPlay={play} onPause={pause} onReset={reset}
                onStepForward={stepForward} onStepBack={stepBack}
                onSpeedChange={setSpeed}
              />
            )}
            {stats && (
              <div className="stats">
                <span>Comparisons: <strong>{stats.comparisons}</strong></span>
                <span>Swaps: <strong>{stats.swaps}</strong></span>
              </div>
            )}
          </>
        )}

        {mode === "linked-list" && (
          <>
            <div className="input-row">
              <select value={llOperation} onChange={e => setLlOperation(e.target.value)}>
                <option value="traverse">Traverse</option>
                <option value="search">Search</option>
                <option value="insert">Insert (tail)</option>
                <option value="delete">Delete</option>
              </select>
              <input
                type="text"
                value={llInput}
                onChange={e => setLlInput(e.target.value)}
                placeholder="e.g. 10, 20, 30, 40"
              />
              {needsTarget && (
                <input
                  type="number"
                  value={llTarget}
                  onChange={e => setLlTarget(e.target.value)}
                  placeholder="target value"
                  style={{ width: "110px" }}
                />
              )}
              <button onClick={handleLLRun} disabled={llLoading} className="btn-primary">
                {llLoading ? "Loading…" : "Run"}
              </button>
            </div>
            {llError && <div className="error">{llError}</div>}
            <LinkedListVisualizer step={llStep} />
            {llSteps.length > 0 && (
              <Controls
                isPlaying={llPlaying}
                currentIndex={llIndex}
                totalSteps={llSteps.length}
                speed={llSpeed}
                onPlay={llPlay}
                onPause={() => setLlPlaying(false)}
                onReset={() => { setLlIndex(0); setLlPlaying(false); }}
                onStepForward={() => setLlIndex(i => Math.min(i + 1, llSteps.length - 1))}
                onStepBack={() => setLlIndex(i => Math.max(i - 1, 0))}
                onSpeedChange={setLlSpeed}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}