"use client";

import React from "react";
import { CustomTab } from "../../hooks";
import CreateNewTab from "./CreateNewTab";
import EditTabHeading from "./EditTabHeading";
import DeleteTab from "./DeleteTab";
import GenerateCode from "./GenerateCode";

interface ButtonControlsProps {
  customTabs: CustomTab[];
  showRenameButtons: boolean;
  showDeleteButtons: boolean;
  isGenerating: boolean;
  onNewTabCreated: (newTab: CustomTab) => void;
  onSelectTab: (tabId: string) => void;
  onStartEditing: (tab: CustomTab) => void;
  onToggleRenameButtons: () => void;
  onToggleDeleteButtons: () => void;
  onGenerateCode: () => void;
}

const ButtonControls: React.FC<ButtonControlsProps> = ({
  customTabs,
  showRenameButtons,
  showDeleteButtons,
  isGenerating,
  onNewTabCreated,
  onSelectTab,
  onStartEditing,
  onToggleRenameButtons,
  onToggleDeleteButtons,
  onGenerateCode
}) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <CreateNewTab
        onNewTabCreated={onNewTabCreated}
        onSelectTab={onSelectTab}
        onStartEditing={onStartEditing}
      />
      
      <EditTabHeading
        showRenameButtons={showRenameButtons}
        onToggleRenameButtons={onToggleRenameButtons}
        customTabsLength={customTabs.length}
      />
      
      <DeleteTab
        showDeleteButtons={showDeleteButtons}
        onToggleDeleteButtons={onToggleDeleteButtons}
        customTabsLength={customTabs.length}
      />
      
      <GenerateCode
        isGenerating={isGenerating}
        onGenerateCode={onGenerateCode}
        customTabsLength={customTabs.length}
      />
    </div>
  );
};

export default ButtonControls;
