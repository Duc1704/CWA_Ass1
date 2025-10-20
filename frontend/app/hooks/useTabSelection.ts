import { useState, useEffect, useCallback } from "react";

const TAB_COOKIE = "selected-tab";
const COOKIE_EXPIRY_DAYS = 365;

// Utility functions for cookies
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number = COOKIE_EXPIRY_DAYS): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

export function useTabSelection(totalTabs: number) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load saved tab from cookie on mount
  useEffect(() => {
    const savedTab = getCookie(TAB_COOKIE);
    if (savedTab !== null) {
      const index = parseInt(savedTab, 10);
      if (!isNaN(index) && index >= 0 && index < totalTabs) {
        setSelectedIndex(index);
      }
    }
    setIsLoaded(true);
  }, [totalTabs]);

  // Save selected tab to cookie on change
  useEffect(() => {
    if (isLoaded && totalTabs > 0) {
      setCookie(TAB_COOKIE, selectedIndex.toString());
    }
  }, [selectedIndex, isLoaded, totalTabs]);

  const selectTab = useCallback((index: number) => {
    if (index >= 0 && index < totalTabs) {
      setSelectedIndex(index);
    }
  }, [totalTabs]);

  const selectNextTab = useCallback(() => {
    setSelectedIndex(prev => (prev + 1) % totalTabs);
  }, [totalTabs]);

  const selectPreviousTab = useCallback(() => {
    setSelectedIndex(prev => (prev - 1 + totalTabs) % totalTabs);
  }, [totalTabs]);

  const selectFirstTab = useCallback(() => {
    setSelectedIndex(0);
  }, []);

  const selectLastTab = useCallback(() => {
    setSelectedIndex(totalTabs - 1);
  }, [totalTabs]);

  return {
    selectedIndex,
    isLoaded,
    selectTab,
    selectNextTab,
    selectPreviousTab,
    selectFirstTab,
    selectLastTab
  };
}
