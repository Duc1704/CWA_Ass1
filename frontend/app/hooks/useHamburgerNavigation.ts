import { useEffect, useCallback } from "react";

export function useHamburgerNavigation(onTabSwitch: (index: number) => void) {
  useEffect(() => {
    const handleSwitchTab = (event: CustomEvent<{ index: number }>) => {
      const { index } = event.detail;
      if (index >= 0) {
        onTabSwitch(index);
      }
    };

    window.addEventListener('switchTab', handleSwitchTab as EventListener);
    return () => {
      window.removeEventListener('switchTab', handleSwitchTab as EventListener);
    };
  }, [onTabSwitch]);

  const dispatchTabSwitch = useCallback((index: number) => {
    window.dispatchEvent(new CustomEvent('switchTab', { detail: { index } }));
  }, []);

  return {
    dispatchTabSwitch
  };
}
