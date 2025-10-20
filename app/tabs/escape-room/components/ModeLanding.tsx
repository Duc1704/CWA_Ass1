import React from "react";

type Props = {
  onCreateQuestion: () => void;
  onPrevTopics: () => void;
};

export default function ModeLanding({ onCreateQuestion, onPrevTopics }: Props): JSX.Element {
  return (
    <div className="mx-4 w-full max-w-xl bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-center mb-6">Escape Room</h2>
      <div className="space-y-3">
        <button onClick={onCreateQuestion} className="w-full px-4 py-3 rounded-md bg-white/10 border border-white/40 hover:bg-white/20">Create a question</button>
        <button onClick={onPrevTopics} className="w-full px-4 py-3 rounded-md border border-white/40 hover:bg-white/10">Previous topic</button>
      </div>
    </div>
  );
}


