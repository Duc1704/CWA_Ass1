import React from 'react';
import Button from '../Button';

interface EditContentProps {
  onStartEditing: () => void;
  hasContent: boolean;
  isEditing: boolean;
}

const EditContent: React.FC<EditContentProps> = ({
  onStartEditing,
  hasContent,
  isEditing
}) => {
  if (!hasContent || isEditing) return null;

  return (
    <Button
      onClick={onStartEditing}
      variant="success"
      size="sm"
    >
      Edit Content
    </Button>
  );
};

export default EditContent;
