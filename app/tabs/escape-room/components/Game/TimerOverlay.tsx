import React from "react";

type Props = {
  remaining: number;
  running: boolean;
  formatTime: (n: number) => string;
  onToggle: () => void;
};

export default function TimerOverlay({ remaining, running, formatTime, onToggle }: Props): JSX.Element {
  return (
    <div className="absolute top-4 left-4 z-10 text-white select-none">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="size-[104px] rounded-full bg-black/50 ring-4 ring-white/80 flex flex-col items-center justify-center shadow-xl">
            <div className="text-sm tracking-[0.2em] opacity-90 mb-0.5">TIME</div>
            <div className="text-3xl font-extrabold tabular-nums">{formatTime(remaining)}</div>
          </div>
          <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-red-500 border-l-red-500 rotate-[-45deg] pointer-events-none"></div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="size-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/80 flex items-center justify-center text-white hover:bg-white/30 shadow-lg"
          aria-label={running ? "Pause timer" : "Resume timer"}
          title={running ? "Pause" : "Resume"}
        >
          <span className="text-xl font-bold leading-none">{running ? "Ⅱ" : "▶"}</span>
        </button>
      </div>
    </div>
  );
}


