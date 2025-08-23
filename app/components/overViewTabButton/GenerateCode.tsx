import React from 'react';
import Button from '../Button';

interface GenerateCodeProps {
  isGenerating: boolean;
  onGenerateCode: () => void;
  customTabsLength: number;
}

const GenerateCode: React.FC<GenerateCodeProps> = ({
  isGenerating,
  onGenerateCode,
  customTabsLength
}) => {
  if (customTabsLength === 0) return null;

  return (
    <Button
      onClick={onGenerateCode}
      disabled={isGenerating}
      variant="primary"
      className="bg-purple-600 hover:bg-purple-700"
    >
      {isGenerating ? "Generating..." : "Generate Code"}
    </Button>
  );
};

export default GenerateCode;
