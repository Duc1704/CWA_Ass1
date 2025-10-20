import React from "react";

type Props = {
  question: string;
  hints: [string, string, string];
  answer: string;
  onChange: (data: { question?: string; hints?: [string, string, string]; answer?: string }) => void;
};

export default function WizardQuestionFields({ question, hints, answer, onChange }: Props): JSX.Element {
  return (
    <>
      <label className="block text-sm mb-1">Question</label>
      <textarea
        rows={3}
        value={question}
        onChange={(e) => onChange({ question: e.target.value })}
        placeholder="Type your question"
        className="w-full mb-4 px-3 py-2 rounded-md bg-black/60 text-white placeholder:text-white/70 border border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 outline-none"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {[0,1,2].map((h) => (
          <div key={h} className="flex flex-col">
            <label className="block text-sm mb-1">Hint {h+1}</label>
            <input
              type="text"
              value={hints[h]}
              onChange={(e) => {
                const nh = [...hints] as [string, string, string];
                nh[h] = e.target.value;
                onChange({ hints: nh });
              }}
              placeholder={`Enter hint ${h+1}`}
              className="w-full px-3 py-2 rounded-md bg-black/60 text-white placeholder:text-white/70 border border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 outline-none"
            />
          </div>
        ))}
      </div>

      <label className="block text-sm mb-1">Answer</label>
      <input
        type="text"
        value={answer}
        onChange={(e) => onChange({ answer: e.target.value })}
        placeholder="Type the answer"
        className="w-full mb-6 px-3 py-2 rounded-md bg-black/60 text-white placeholder:text-white/70 border border-white/30 focus:border-white focus:ring-2 focus:ring-white/30 outline-none"
      />
    </>
  );
}


