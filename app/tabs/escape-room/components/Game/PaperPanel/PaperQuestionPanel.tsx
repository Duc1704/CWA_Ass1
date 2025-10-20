import React from "react";

type Props = {
  question: string;
  answerValue: string;
  onAnswerChange: (v: string) => void;
  error?: string;
  onClose: () => void;
  onSubmit: () => void;
};

export default function PaperQuestionPanel({ question, answerValue, onAnswerChange, error, onClose, onSubmit }: Props): JSX.Element {
  return (
    <div
      className="relative inline-block shadow-2xl"
      style={{ width: 'min(98vw, 1400px)' }}
    >
      <div
        className="relative"
        style={{
          width: 'min(98vw, 1400px)',
          minHeight: 'min(82vh, 820px)',
          backgroundImage: 'url(/images/oldPaper.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 pt-16 pb-12 text-black flex items-start justify-center px-[6%] sm:px-[8%]">
          <div className="mx-auto" style={{ width: 'min(860px, 45%)' }}>
            <div className="text-xl font-semibold mb-3">Question</div>
            <div className="mb-4 whitespace-pre-wrap text-[15px] leading-relaxed bg-white/70 border border-black/10 rounded-md p-3 w-full">{question}</div>
            <label className="block text-sm mb-1">Your answer</label>
            <input
              type="text"
              value={answerValue}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-white/85 text-black border border-black/20 outline-none placeholder:text-black/60 focus:ring-2 focus:ring-purple-300"
              placeholder="Type your answer"
            />
            {error && (
              <div className="text-red-700 text-sm mt-2" role="alert">{error}</div>
            )}
            <div className="mt-4 flex items-center justify-between gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-black/30 bg-white/70 hover:bg-white/80 text-black">Close</button>
              <button type="button" onClick={onSubmit} className="px-5 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 shadow">Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


