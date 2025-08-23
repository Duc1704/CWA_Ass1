"use client";

import React, { useState } from "react";
import { GeneratedCode } from "../hooks/useCodeGeneration";

interface CodeOutputProps {
  generatedCode: GeneratedCode;
  onClear: () => void;
  onCopy: (code: string) => Promise<boolean>;
}

export default function CodeOutput({ generatedCode, onClear, onCopy }: CodeOutputProps): JSX.Element {
  const [copyStatus, setCopyStatus] = useState<string>('');

  const handleCopy = async (code: string, type: string) => {
    const success = await onCopy(code);
    if (success) {
      setCopyStatus(`${type} copied to clipboard!`);
      setTimeout(() => setCopyStatus(''), 2000);
    } else {
      setCopyStatus('Failed to copy to clipboard');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

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
          <button
            onClick={() => handleCopy(generatedCode.fullCode, 'Full Code')}
            className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600 transition-colors"
          >
            Copy Code
          </button>
        </div>
        <pre className="text-gray-100 text-sm leading-relaxed">
          <code>{generatedCode.fullCode}</code>
        </pre>
      </div>

      {/* Copy Status */}
      {copyStatus && (
        <div className={`text-center p-2 rounded-md text-sm ${
          copyStatus.includes('Failed') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {copyStatus}
        </div>
      )}

      {/* Download Button */}
      <div className="flex justify-center">
        <button
          onClick={() => handleCopy(generatedCode.fullCode, 'Full Code')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          📋 Copy Full Code to Clipboard
        </button>
      </div>
    </div>
  );
}
