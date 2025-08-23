import { useState, useEffect, useCallback } from "react";

export interface CustomTab {
  id: string;
  name: string;
  content: string;
  generatedCode?: string;
}

const CUSTOM_TABS_STORAGE_KEY = "customTabs";

export function useCustomTabs() {
  const [customTabs, setCustomTabs] = useState<CustomTab[]>([]);

  // Load custom tabs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(CUSTOM_TABS_STORAGE_KEY);
    if (saved) {
      try {
        setCustomTabs(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse saved tabs:", error);
      }
    }
  }, []);

  // Save custom tabs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(CUSTOM_TABS_STORAGE_KEY, JSON.stringify(customTabs));
  }, [customTabs]);

  const addCustomTab = useCallback((newTab: CustomTab) => {
    setCustomTabs(prev => [...prev, newTab]);
  }, []);

  const updateCustomTab = useCallback((updatedTab: CustomTab) => {
    setCustomTabs(prev => prev.map(tab => tab.id === updatedTab.id ? updatedTab : tab));
  }, []);

  const deleteCustomTab = useCallback((tabId: string) => {
    setCustomTabs(prev => prev.filter(tab => tab.id !== tabId));
  }, []);

  return {
    customTabs,
    addCustomTab,
    updateCustomTab,
    deleteCustomTab
  };
}
