import React from "react";
import WizardHeader from "./WizardHeader";
import WizardQuestionFields from "./WizardQuestionFields";

type Item = { question: string; hints: [string, string, string]; answer: string };

type Props = {
  items: Item[];
  step: number;
  timerSeconds: number;
  error?: string;
  onTimerChange: (n: number) => void;
  onChangeItem: (index: number, item: Item) => void;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
};

export default function WizardForm({ items, step, timerSeconds, error, onTimerChange, onChangeItem, onBack, onNext, onFinish }: Props): JSX.Element {
  const item = items[step];
  return (
    <form className="mx-4 w-full max-w-3xl bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-6 backdrop-blur-sm" onSubmit={(e) => { e.preventDefault(); onNext(); }}>
      <WizardHeader step={step} total={items.length} timerSeconds={timerSeconds} onTimerChange={onTimerChange} error={error} />

      <WizardQuestionFields
        question={item.question}
        hints={item.hints}
        answer={item.answer}
        onChange={(data) => onChangeItem(step, { ...item, ...data })}
      />

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10">Back</button>
        {step < items.length - 1 ? (
          <button type="submit" className="px-5 py-2.5 rounded-md bg-white/10 border border-white/40 hover:bg-white/20">Next</button>
        ) : (
          <button type="button" onClick={onFinish} className="px-5 py-2.5 rounded-md bg-[--foreground] text-[--background] border border-white/0 hover:opacity-90">Start</button>
        )}
      </div>
    </form>
  );
}


