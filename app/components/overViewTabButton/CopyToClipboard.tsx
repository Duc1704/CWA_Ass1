import React, { useState } from 'react';
import Button from '../Button';

interface CopyToClipboardProps {
  code: string;
  onCopy: (code: string) => Promise<boolean>;
  buttonText?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showStatus?: boolean;
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  code,
  onCopy,
  buttonText = "Copy to Clipboard",
  variant = "primary",
  size = "md",
  className = "",
  showStatus = true
}) => {
  const [copyStatus, setCopyStatus] = useState<string>('');

  const handleCopy = async () => {
    const success = await onCopy(code);
    if (success) {
      setCopyStatus('Copied to clipboard!');
      setTimeout(() => setCopyStatus(''), 2000);
    } else {
      setCopyStatus('Failed to copy to clipboard');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleCopy}
        variant={variant}
        size={size}
        className={className}
      >
        📋 {buttonText}
      </Button>
      
      {/* Copy Status */}
      {showStatus && copyStatus && (
        <div className={`text-center p-2 rounded-md text-sm ${
          copyStatus.includes('Failed') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {copyStatus}
        </div>
      )}
    </div>
  );
};

export default CopyToClipboard;
