interface Props {
  isPlaying: boolean;
  currentIndex: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onSpeedChange: (speed: number) => void;
}

export function Controls({
  isPlaying,
  currentIndex,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBack,
  onSpeedChange,
}: Props) {
  const atEnd = currentIndex >= totalSteps - 1;
  const atStart = currentIndex === 0;

  return (
    <div className="controls">
      <div className="controls-buttons">
        <button onClick={onReset} disabled={atStart} title="Reset">
          ⏮
        </button>
        <button onClick={onStepBack} disabled={atStart} title="Step back">
          ◀
        </button>
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={atEnd}
          title={isPlaying ? "Pause" : "Play"}
          className="play-pause"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <button onClick={onStepForward} disabled={atEnd} title="Step forward">
          ▶
        </button>
      </div>

      <div className="controls-speed">
        <label htmlFor="speed">Speed</label>
        <input
          id="speed"
          type="range"
          min={50}
          max={1000}
          step={50}
          // Invert: high slider value = fast = low ms delay
          value={1050 - speed}
          onChange={(e) => onSpeedChange(1050 - Number(e.target.value))}
        />
        <span>{speed <= 100 ? "Fast" : speed <= 400 ? "Medium" : "Slow"}</span>
      </div>

      <div className="controls-progress">
        Step {totalSteps > 0 ? currentIndex + 1 : 0} / {totalSteps}
      </div>
    </div>
  );
}
