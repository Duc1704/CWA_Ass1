import { useState, useCallback } from "react";
import { CustomTab } from "./useCustomTabs";

export function useTabContentEditing(
  onUpdateCustomTab: (updatedTab: CustomTab) => void
) {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");

  const startEditing = useCallback((tab: CustomTab) => {
    setEditingTabId(tab.id);
    setEditingContent(tab.content);
  }, []);

  const saveContent = useCallback((tab: CustomTab) => {
    const updatedTab = { ...tab, content: editingContent };
    onUpdateCustomTab(updatedTab);
    setEditingTabId(null);
    setEditingContent("");
  }, [editingContent, onUpdateCustomTab]);

  const cancelEditing = useCallback(() => {
    setEditingTabId(null);
    setEditingContent("");
  }, []);

  const updateEditingContent = useCallback((content: string) => {
    setEditingContent(content);
  }, []);

  return {
    editingTabId,
    editingContent,
    startEditing,
    saveContent,
    cancelEditing,
    updateEditingContent
  };
}
