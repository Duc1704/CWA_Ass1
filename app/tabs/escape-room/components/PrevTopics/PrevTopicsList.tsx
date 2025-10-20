import React from "react";

type Item = { question: string; answer: string; hints: [string, string, string] };
type Topic = { title: string; items: Item[]; timerSeconds: number };

type Props = {
  topics: Topic[];
  selectedIndex: number | null;
  onSelect: (idx: number) => void;
  onUse: (topic: Topic) => void;
  onDelete: (topic: Topic) => void;
};

export default function PrevTopicsList({ topics, selectedIndex, onSelect, onUse, onDelete }: Props): JSX.Element {
  return (
    <div className="mx-4 w-full max-w-2xl bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-center mb-4">Previous topics</h2>
      {topics.length === 0 ? (
        <div className="text-sm opacity-80">No topics saved yet.</div>
      ) : (
        <ul className="space-y-2">
          {topics.map((t, idx) => (
            <li key={idx} className={`rounded-md border ${selectedIndex === idx ? "border-white bg-white/10" : "border-white/20"}`}>
              <button onClick={() => onSelect(idx)} className="w-full text-left px-4 py-3">
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm opacity-80">{t.items.length} questions</div>
              </button>
              {selectedIndex === idx && (
                <div className="px-4 pb-3">
                  <div className="text-sm opacity-80 mb-2">Preview:</div>
                  <ul className="list-disc list-inside text-sm opacity-90 space-y-1">
                    {t.items.map((it, qi) => (
                      <li key={qi}>{it.question}</li>
                    ))}
                  </ul>
                  <div className="mt-3 flex gap-2">
                    <button className="px-4 py-2 rounded-md bg-white/10 border border-white/40 hover:bg-white/20" onClick={() => onUse(t)}>Use this topic</button>
                    <button className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10" onClick={() => onDelete(t)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


