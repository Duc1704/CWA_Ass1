import React from 'react';
import Button from '../Button';

interface EditTabHeadingProps {
  showRenameButtons: boolean;
  onToggleRenameButtons: () => void;
  customTabsLength: number;
}

const EditTabHeading: React.FC<EditTabHeadingProps> = ({
  showRenameButtons,
  onToggleRenameButtons,
  customTabsLength
}) => {
  if (customTabsLength === 0) return null;

  return (
    <Button
      onClick={onToggleRenameButtons}
      variant={showRenameButtons ? "warning" : "secondary"}
      title={showRenameButtons ? "Hide edit buttons" : "Show edit buttons"}
    >
      {showRenameButtons ? "Edit Tab Heading" : "Edit Tab Heading"}
    </Button>
  );
};

export default EditTabHeading;
