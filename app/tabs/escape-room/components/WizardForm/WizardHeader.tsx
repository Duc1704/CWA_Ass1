import React from "react";

type Props = {
  step: number;
  total: number;
  timerSeconds: number;
  onTimerChange: (n: number) => void;
  error?: string;
};

export default function WizardHeader({ step, total, timerSeconds, onTimerChange, error }: Props): JSX.Element {
  return (
    <>
      <h2 className="text-xl font-bold text-center mb-4">Write question for your topic</h2>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm opacity-80">Question {step + 1} of {total}</div>
        <div className="flex items-center gap-2">
          <label className="text-sm opacity-80">Timer (s)</label>
          <input
            type="number"
            min={10}
            max={3600}
            value={timerSeconds}
            onChange={(e) => onTimerChange(Math.max(10, Math.min(3600, Number(e.target.value) || 10)))}
            className="w-28 px-2 py-1 rounded-md bg-black/60 text-white border border-white/30 outline-none"
          />
        </div>
      </div>
      {error && <div className="text-red-400 text-sm mb-3" role="alert">{error}</div>}
    </>
  );
}


