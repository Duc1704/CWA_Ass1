import React from "react";

type Props = {
  hint: string;
  onClose: () => void;
};

export default function PaperHintPanel({ hint, onClose }: Props): JSX.Element {
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
            <div className="text-xl font-semibold mb-3">Hint</div>
            <div className="whitespace-pre-wrap text-[15px] leading-relaxed bg-white/70 border border-black/10 rounded-md p-3 w-full">{hint}</div>
            <div className="mt-4 flex items-center justify-start gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-black/30 bg-white/70 hover:bg-white/80 text-black">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


