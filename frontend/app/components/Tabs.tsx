"use client";

import { useMemo } from "react";
import OverviewTab from "../tabs/OverviewTab";
import PrelabTab from "../tabs/PrelabTab";
import EscapeRoomTab from "../tabs/EscapeRoomTab";
import CodingRacesTab from "../tabs/CodingRacesTab";
import AboutTab from "../tabs/AboutTab";
import { 
  useCustomTabs, 
  useTabSelection, 
  useHamburgerNavigation
} from "../hooks";
import { TabNavigationBar } from "./navigation";

// Types
type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};



// Main Component
export default function Tabs(): JSX.Element {
  // Custom hooks
  const {
    customTabs,
    addCustomTab,
    updateCustomTab,
    deleteCustomTab,
    startRenamingTab,
    saveTabName,
    cancelRenamingTab
  } = useCustomTabs();

  const {
    selectedIndex,
    isLoaded,
    selectTab,
    selectNextTab,
    selectPreviousTab,
    selectFirstTab,
    selectLastTab
  } = useTabSelection(5); // 5 static tabs



  // Hamburger navigation
  useHamburgerNavigation(selectTab);

  // Tab Configuration
  const tabs: TabItem[] = useMemo(() => [
    { 
      id: "tabs", 
      label: "Tabs", 
      content: (
        <OverviewTab 
          onNewTabCreated={addCustomTab} 
          customTabs={customTabs} 
          onDeleteCustomTab={deleteCustomTab} 
          onUpdateCustomTab={updateCustomTab}
          onStartRenamingTab={startRenamingTab}
          onSaveTabName={saveTabName}
          onCancelRenamingTab={cancelRenamingTab}
        />
      ) 
    },
    { id: "prelab", label: "Pre-lab Questions", content: <PrelabTab /> },
    { id: "escape", label: "Escape Room", content: <EscapeRoomTab /> },
    { id: "races", label: "Coding Races", content: <CodingRacesTab /> },
    { id: "about", label: "About", content: <AboutTab /> },
  ], [addCustomTab, customTabs, deleteCustomTab, updateCustomTab, startRenamingTab, saveTabName, cancelRenamingTab]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectNextTab();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectPreviousTab();
    } else if (event.key === "Home") {
      event.preventDefault();
      selectFirstTab();
    } else if (event.key === "End") {
      event.preventDefault();
      selectLastTab();
    }
  };

  return (
    <section aria-label="Tabs section" className="w-full">
      <TabNavigationBar
        tabs={tabs}
        selectedIndex={selectedIndex}
        onTabSelect={selectTab}
        onKeyDown={onKeyDown}
        isLoaded={isLoaded}
      />
      
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
    </section>
  );
}


