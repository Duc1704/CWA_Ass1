"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import OverviewTab from "../tabs/OverviewTab";
import PrelabTab from "../tabs/PrelabTab";
import EscapeRoomTab from "../tabs/EscapeRoomTab";
import CodingRacesTab from "../tabs/CodingRacesTab";
import AboutTab from "../tabs/AboutTab";

type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

const TAB_COOKIE = "selected-tab";

function classNames(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

// Helper functions for cookies
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number = 365): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

export default function Tabs(): JSX.Element {
  const tabs: TabItem[] = useMemo(
    () => [
      { id: "tabs", label: "Tabs", content: <OverviewTab /> },
      { id: "prelab", label: "Pre-lab Questions", content: <PrelabTab /> },
      { id: "escape", label: "Escape Room", content: <EscapeRoomTab /> },
      { id: "races", label: "Coding Races", content: <CodingRacesTab /> },
      { id: "about", label: "About", content: <AboutTab /> },
    ],
    []
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load saved tab from cookie on mount
  useEffect(() => {
    const savedTab = getCookie(TAB_COOKIE);
    if (savedTab !== null) {
      const index = parseInt(savedTab, 10);
      if (!isNaN(index) && index >= 0 && index < tabs.length) {
        setSelectedIndex(index);
      }
    }
    setIsLoaded(true);
  }, [tabs.length]);

  // Save selected tab to cookie whenever it changes
  useEffect(() => {
    if (isLoaded) {
      setCookie(TAB_COOKIE, selectedIndex.toString());
    }
  }, [selectedIndex, isLoaded]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % tabs.length);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + tabs.length) % tabs.length);
      } else if (event.key === "Home") {
        event.preventDefault();
        setSelectedIndex(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setSelectedIndex(tabs.length - 1);
      }
    },
    [tabs.length]
  );

  // Listen for hamburger menu navigation
  useEffect(() => {
    const handleSwitchTab = (event: CustomEvent) => {
      setSelectedIndex(event.detail.index);
    };

    window.addEventListener('switchTab', handleSwitchTab as EventListener);
    return () => {
      window.removeEventListener('switchTab', handleSwitchTab as EventListener);
    };
  }, []);

  // Don't render until cookie is loaded to prevent tab jumping
  if (!isLoaded) {
    return (
      <section aria-label="Tabs section" className="w-full">
        <div className="mx-auto max-w-5xl w-full select-none">
          <div className="flex items-center justify-center gap-3 text-sm sm:text-base">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={false}
                aria-controls={`panel-${tab.id}`}
                tabIndex={-1}
                className="px-2 py-1 rounded-sm border border-transparent text-[--foreground] opacity-50"
                disabled
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mx-auto mt-2 h-[2px] w-full max-w-5xl bg-[--foreground]/80" />
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Tabs section" className="w-full">
      <div
        role="tablist"
        aria-label="Pages"
        className="mx-auto max-w-5xl w-full select-none"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center justify-center gap-3 text-sm sm:text-base">
          {tabs.map((tab, index) => {
            const selected = index === selectedIndex;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setSelectedIndex(index)}
                className={classNames(
                  "px-2 py-1 rounded-sm transition-colors",
                  selected
                    ? "border border-[color:rgba(128,128,128,0.6)]"
                    : "border border-transparent",
                  "text-[--foreground]"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Separator line under the tabs */}
        <div className="mx-auto mt-2 h-[2px] w-full max-w-5xl bg-[--foreground]/80" />

        {/* Panels */}
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={index !== selectedIndex}
            className="mx-auto mt-4 max-w-5xl text-[--foreground]"
          >
            {tab.content}
          </div>
        ))}
      </div>
    </section>
  );
}


