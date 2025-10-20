import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
  error?: string;
};

export default function TopicNameForm({ value, onChange, onBack, onNext, error }: Props): JSX.Element {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="mx-4 w-full max-w-lg bg-[--background]/95 text-white border border-white/20 rounded-lg shadow-xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-center mb-4">Create topic</h2>
      <label className="block text-sm mb-1">Topic name</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="e.g., History" className="w-full mb-3 px-3 py-2 rounded-md bg-black/60 text-white border border-white/30 outline-none" />
      {error && <div className="text-red-400 text-sm mb-3" role="alert">{error}</div>}
      <div className="flex justify-between mt-2">
        <button type="button" onClick={onBack} className="px-4 py-2 rounded-md border border-white/40 hover:bg-white/10">Back</button>
        <button type="submit" className="px-5 py-2.5 rounded-md bg-white/10 border border-white/40 hover:bg-white/20">Next</button>
      </div>
    </form>
  );
}


