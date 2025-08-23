import React from 'react';
import Button from '../Button';

interface DeleteTabProps {
  showDeleteButtons: boolean;
  onToggleDeleteButtons: () => void;
  customTabsLength: number;
}

const DeleteTab: React.FC<DeleteTabProps> = ({
  showDeleteButtons,
  onToggleDeleteButtons,
  customTabsLength
}) => {
  if (customTabsLength === 0) return null;

  return (
    <Button
      onClick={onToggleDeleteButtons}
      variant={showDeleteButtons ? "danger" : "secondary"}
      title={showDeleteButtons ? "Hide delete buttons" : "Show delete buttons"}
    >
      {showDeleteButtons ? "Delete Tab" : "Delete Tab"}
    </Button>
  );
};

export default DeleteTab;
