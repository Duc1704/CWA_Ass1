"use client";

import React from "react";
import { GeneratedCode } from "../hooks/useCodeGeneration";
import CopyToClipboard from "./overViewTabButton/CopyToClipboard";

interface CodeOutputProps {
  generatedCode: GeneratedCode;
  onClear: () => void;
  onCopy: (code: string) => Promise<boolean>;
}

export default function CodeOutput({ generatedCode, onClear, onCopy }: CodeOutputProps): JSX.Element {

  return (
    <div className="bg-[--background] border border-[--foreground]/20 rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-[--foreground]">Generated Code</h3>
        <button
          onClick={onClear}
          className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
        >
          Clear Output
        </button>
      </div>

      {/* Code Display */}
      <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 text-sm font-medium">Full HTML Code</span>
          <CopyToClipboard
            code={generatedCode.fullCode}
            onCopy={onCopy}
            buttonText="Copy Code"
            variant="secondary"
            size="sm"
            className="bg-gray-700 text-gray-300 hover:bg-gray-600"
            showStatus={false}
          />
        </div>
        <pre className="text-gray-100 text-sm leading-relaxed">
          <code>{generatedCode.fullCode}</code>
        </pre>
      </div>



      {/* Copy Button */}
      <div className="flex justify-center">
        <CopyToClipboard
          code={generatedCode.fullCode}
          onCopy={onCopy}
          buttonText="Copy Full Code to Clipboard"
          variant="success"
          size="lg"
          className="px-6 py-3"
        />
      </div>
    </div>
  );
}
