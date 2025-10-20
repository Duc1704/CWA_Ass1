import React from "react";

type Pos = { top: string; left: string };
type Props = {
  hints: Pos[];
  lock: Pos;
  onOpenHint: (index: number) => void;
  onOpenQA: () => void;
  canNext: boolean;
  onNext: () => void;
};

export default function HotspotsOverlay({ hints, lock, onOpenHint, onOpenQA, canNext, onNext }: Props): JSX.Element {
  return (
    <div className="absolute inset-0">
      {(hints || []).map((pos, i) => (
        <button
          key={`h-${i}`}
          type="button"
          onClick={() => onOpenHint(i)}
          className="absolute -translate-x-1/2 -translate-y-1/2 size-12 rounded-full bg-white/15 border border-white/40 text-white text-xl flex items-center justify-center hover:bg-white/25"
          style={{ top: pos.top, left: pos.left }}
          aria-label={`Hint ${i+1}`}
          title={`Hint ${i+1}`}
        >
          <span>👁️</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onOpenQA}
        className="absolute -translate-x-1/2 -translate-y-1/2 size-12 rounded-full bg-white/15 border border-white/40 text-white text-xl flex items-center justify-center hover:bg-white/25"
        style={{ top: lock.top, left: lock.left }}
        aria-label="Question and Answer"
        title="Question and Answer"
      >
        <span>🔒</span>
      </button>
      {canNext && (
        <button
          type="button"
          onClick={onNext}
          className="absolute right-6 bottom-6 size-12 rounded-full bg-white/20 border border-white/40 text-white text-xl flex items-center justify-center hover:bg-white/30"
          aria-label="Next phase"
          title="Next phase"
        >
          ➡️
        </button>
      )}
    </div>
  );
}


