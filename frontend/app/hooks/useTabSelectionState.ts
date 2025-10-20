import { useState, useCallback } from "react";

export function useTabSelectionState() {
  const [selectedCustomTabId, setSelectedCustomTabId] = useState<string | null>(null);

  const selectTab = useCallback((tabId: string) => {
    setSelectedCustomTabId(prev => prev === tabId ? null : tabId);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedCustomTabId(null);
  }, []);

  return {
    selectedCustomTabId,
    selectTab,
    clearSelection
  };
}
