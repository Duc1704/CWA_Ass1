"use client";

import React from "react";
import { CustomTab } from "../../hooks";
import TabHeader from "./TabHeader";
import TabContent from "./TabContent";

interface CustomTabsDisplayProps {
  customTabs: CustomTab[];
  selectedCustomTabId: string | null;
  editingTabId: string | null;
  editingContent: string;
  showRenameButtons: boolean;
  showDeleteButtons: boolean;
  onSelectTab: (tabId: string) => void;
  onStartRenaming: (tabId: string) => void;
  onSaveName: (tabId: string, newName: string) => void;
  onCancelRenaming: (tabId: string) => void;
  onDeleteTab: (tabId: string) => void;
  onEditContentChange: (content: string) => void;
  onStartEditing: () => void;
  onSaveContent: () => void;
  onCancelEditing: () => void;
}

const CustomTabsDisplay: React.FC<CustomTabsDisplayProps> = ({
  customTabs,
  selectedCustomTabId,
  editingTabId,
  editingContent,
  showRenameButtons,
  showDeleteButtons,
  onSelectTab,
  onStartRenaming,
  onSaveName,
  onCancelRenaming,
  onDeleteTab,
  onEditContentChange,
  onStartEditing,
  onSaveContent,
  onCancelEditing
}) => {
  if (customTabs.length === 0) {
    return (
      <div className="text-center py-8 text-[--foreground]/60">
        <p className="text-lg">No custom tabs created yet.</p>
        <p className="text-sm">Create your first tab above!</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Your Custom Tabs</h3>
      
      {/* Tab Headers */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {customTabs.map((tab) => (
          <TabHeader
            key={tab.id}
            tab={tab}
            isSelected={selectedCustomTabId === tab.id}
            onSelect={onSelectTab}
            onStartRenaming={onStartRenaming}
            onSaveName={onSaveName}
            onCancelRenaming={onCancelRenaming}
            showRenameButtons={showRenameButtons}
            showDeleteButtons={showDeleteButtons}
            onDeleteTab={onDeleteTab}
          />
        ))}
      </div>

      {/* Content Area */}
      {selectedCustomTabId && (() => {
        const selectedTab = customTabs.find(tab => tab.id === selectedCustomTabId);
        if (!selectedTab) return null;
        
        return (
          <TabContent
            tab={selectedTab}
            isEditing={editingTabId === selectedTab.id}
            editingContent={editingContent}
            onEditContentChange={onEditContentChange}
            onStartEditing={onStartEditing}
            onSaveContent={onSaveContent}
            onCancelEditing={onCancelEditing}
          />
        );
      })()}
    </div>
  );
};

export default CustomTabsDisplay;
