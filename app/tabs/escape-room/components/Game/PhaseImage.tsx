import React from "react";

type Props = { src: string };

export default function PhaseImage({ src }: Props): JSX.Element {
  return (
    <div className="absolute inset-0">
      <img
        src={src}
        alt="stage"
        className="w-full h-full object-cover select-none pointer-events-none"
      />
    </div>
  );
}


