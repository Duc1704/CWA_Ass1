import { useState, useCallback } from "react";
import { CustomTab } from "./useCustomTabs";

const TAB_ID_PREFIX = "custom-";

export function useTabForm(onNewTabCreated: (newTab: CustomTab) => void) {
  const [newTabName, setNewTabName] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  const handleCreateTab = useCallback(() => {
    if (newTabName.trim()) {
      const newTab: CustomTab = {
        id: `${TAB_ID_PREFIX}${Date.now().toString()}`,
        name: newTabName.trim(),
        content: ""
      };
      onNewTabCreated(newTab);
      setNewTabName("");
      setShowCreateForm(false);
      return newTab; // Return the created tab
    }
    return null;
  }, [newTabName, onNewTabCreated]);

  const showForm = useCallback(() => {
    setShowCreateForm(true);
  }, []);

  const hideForm = useCallback(() => {
    setShowCreateForm(false);
    setNewTabName("");
  }, []);

  const updateTabName = useCallback((name: string) => {
    setNewTabName(name);
  }, []);

  return {
    newTabName,
    showCreateForm,
    handleCreateTab,
    showForm,
    hideForm,
    updateTabName
  };
}
