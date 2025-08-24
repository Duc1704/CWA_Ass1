"use client";

import React from "react";

// Types
interface TabItem {
  id: string;
  label: string;
}

interface TabNavigationBarProps {
  tabs: TabItem[];
  selectedIndex: number;
  onTabSelect: (index: number) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  isLoaded: boolean;
}

// Utility Functions
function classNames(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export default function TabNavigationBar({
  tabs,
  selectedIndex,
  onTabSelect,
  onKeyDown,
  isLoaded
}: TabNavigationBarProps): JSX.Element {
  // Don't render until loaded to prevent tab jumping
  if (!isLoaded) {
    return (
      <section aria-label="Tabs section" className="w-full">
        <div className="mx-auto max-w-5xl w-full select-none px-4">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
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
        className="mx-auto max-w-5xl w-full select-none px-4"
        onKeyDown={onKeyDown}
      >
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base">
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
                onClick={() => onTabSelect(index)}
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
        <div className="mx-auto mt-2 h-[2px] w-full max-w-5xl bg-[--foreground]/80" />
      </div>
    </section>
  );
}
