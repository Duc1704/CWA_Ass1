import { useState } from "react";

export function useTabDisplay() {
  const [showRenameButtons, setShowRenameButtons] = useState(false);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);

  const toggleRenameButtons = () => setShowRenameButtons(!showRenameButtons);
  const toggleDeleteButtons = () => setShowDeleteButtons(!showDeleteButtons);

  return {
    showRenameButtons,
    showDeleteButtons,
    toggleRenameButtons,
    toggleDeleteButtons
  };
}
