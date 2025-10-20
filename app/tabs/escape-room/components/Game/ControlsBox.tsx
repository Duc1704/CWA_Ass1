import React from "react";

type Props = {
  onOpenPanel: (key: "hint1" | "hint2" | "hint3" | "qa") => void;
  canNext: boolean;
  onNext: () => void;
};

export default function ControlsBox({ onOpenPanel, canNext, onNext }: Props): JSX.Element {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[min(720px,92%)]">
      <div className="absolute -bottom-3 left-8 right-8 h-4 bg-black/50 blur-md rounded-full" aria-hidden="true"></div>
      <div className="relative rounded-xl bg-black/55 border border-white/25 backdrop-blur-sm px-4 py-3 shadow-[0_12px_28px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-center gap-4">
          {["hint1", "hint2", "hint3"].map((key, i) => (
            <button
              key={key}
              type="button"
              onClick={() => onOpenPanel(key as any)}
              className="size-12 rounded-full bg-white/15 border border-white/40 text-white text-xl flex items-center justify-center hover:bg-white/25"
              aria-label={`Hint ${i+1}`}
              title={`Hint ${i+1}`}
            >
              <span>👁️</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => onOpenPanel("qa")}
            className="size-12 rounded-full bg-white/15 border border-white/40 text-white text-xl flex items-center justify-center hover:bg-white/25"
            aria-label="Question and Answer"
            title="Question and Answer"
          >
            <span>🔒</span>
          </button>
          {canNext && (
            <button
              type="button"
              onClick={onNext}
              className="size-12 rounded-full bg-white/20 border border-white/40 text-white text-xl flex items-center justify-center hover:bg-white/30"
              aria-label="Next phase"
              title="Next phase"
            >
              ➡️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


