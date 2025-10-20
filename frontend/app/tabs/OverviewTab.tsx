"use client";

import React from "react";
import { 
  CustomTab, 
  useTabContentEditing, 
  useTabSelectionState,
  useTabDisplay,
  useTabActions
} from "../hooks";
import ButtonControls from "../components/overViewTabButton/ButtonControls";
import CustomTabsDisplay from "../components/overViewTabButton/CustomTabsDisplay";
import GeneratedCodeOutput from "../components/overViewTabButton/GeneratedCodeOutput";

interface OverviewTabProps {
  onNewTabCreated: (newTab: CustomTab) => void;
  customTabs: CustomTab[];
  onDeleteCustomTab: (tabId: string) => void;
  onUpdateCustomTab: (updatedTab: CustomTab) => void;
  onStartRenamingTab: (tabId: string) => void;
  onSaveTabName: (tabId: string, newName: string) => void;
  onCancelRenamingTab: (tabId: string) => void;
}

export default function OverviewTab({ 
  onNewTabCreated, 
  customTabs, 
  onDeleteCustomTab, 
  onUpdateCustomTab,
  onStartRenamingTab,
  onSaveTabName,
  onCancelRenamingTab
}: OverviewTabProps): JSX.Element {
  // Custom hooks
  const {
    showRenameButtons,
    showDeleteButtons,
    toggleRenameButtons,
    toggleDeleteButtons
  } = useTabDisplay();

  const {
    editingTabId,
    editingContent,
    startEditing,
    saveContent,
    cancelEditing,
    updateEditingContent
  } = useTabContentEditing(onUpdateCustomTab);

  const {
    selectedCustomTabId,
    selectTab
  } = useTabSelectionState();

  // Tab actions hook
  const {
    generatedCode,
    isGenerating,
    generateAllTabsCode,
    clearGeneratedCode,
    copyToClipboard
  } = useTabActions(customTabs, onUpdateCustomTab);

  return (
    <div id="tabs" className="text-[--foreground] p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Custom Tab Creator</h2>
      </div>
      
      {/* Button Controls */}
      <ButtonControls
        customTabs={customTabs}
        showRenameButtons={showRenameButtons}
        showDeleteButtons={showDeleteButtons}
        isGenerating={isGenerating}
        onNewTabCreated={onNewTabCreated}
        onSelectTab={selectTab}
        onStartEditing={startEditing}
        onToggleRenameButtons={toggleRenameButtons}
        onToggleDeleteButtons={toggleDeleteButtons}
        onGenerateCode={generateAllTabsCode}
      />

      {/* Custom Tabs Display */}
      <CustomTabsDisplay
        customTabs={customTabs}
        selectedCustomTabId={selectedCustomTabId}
        editingTabId={editingTabId}
        editingContent={editingContent}
        showRenameButtons={showRenameButtons}
        showDeleteButtons={showDeleteButtons}
        onSelectTab={selectTab}
        onStartRenaming={onStartRenamingTab}
        onSaveName={onSaveTabName}
        onCancelRenaming={onCancelRenamingTab}
        onDeleteTab={onDeleteCustomTab}
        onEditContentChange={updateEditingContent}
        onStartEditing={() => startEditing(customTabs.find(tab => tab.id === selectedCustomTabId)!)}
        onSaveContent={() => saveContent(customTabs.find(tab => tab.id === selectedCustomTabId)!)}
        onCancelEditing={cancelEditing}
      />

      {/* Generated Code Output */}
      <GeneratedCodeOutput
        generatedCode={generatedCode}
        onClear={clearGeneratedCode}
        onCopy={copyToClipboard}
      />
    </div>
  );
}
