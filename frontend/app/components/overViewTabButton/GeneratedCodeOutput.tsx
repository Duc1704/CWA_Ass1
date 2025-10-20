"use client";

import React from "react";
import { GeneratedCode } from "../../hooks";
import CodeOutput from "../CodeOutput";

interface GeneratedCodeOutputProps {
  generatedCode: GeneratedCode | null;
  onClear: () => void;
  onCopy: (code: string) => Promise<boolean>;
}

const GeneratedCodeOutput: React.FC<GeneratedCodeOutputProps> = ({
  generatedCode,
  onClear,
  onCopy
}) => {
  if (!generatedCode) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 text-[--foreground]">Generated Code</h3>
      <CodeOutput
        generatedCode={generatedCode}
        onClear={onClear}
        onCopy={onCopy}
      />
    </div>
  );
};

export default GeneratedCodeOutput;
