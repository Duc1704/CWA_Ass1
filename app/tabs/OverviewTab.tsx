"use client";

import React, { useState } from "react";
import { 
  CustomTab, 
  useTabForm, 
  useTabContentEditing, 
  useTabSelectionState,
  useCodeGeneration
} from "../hooks";
import CodeOutput from "../components/CodeOutput";

interface OverviewTabProps {
  onNewTabCreated: (newTab: CustomTab) => void;
  customTabs: CustomTab[];
  onDeleteCustomTab: (tabId: string) => void;
  onUpdateCustomTab: (updatedTab: CustomTab) => void;
  onStartRenamingTab: (tabId: string) => void;
  onSaveTabName: (tabId: string, newName: string) => void;
  onCancelRenamingTab: (tabId: string) => void;
}

// Sub-components
interface CreateTabFormProps {
  newTabName: string;
  showCreateForm: boolean;
  onNewTabNameChange: (name: string) => void;
  onShowForm: () => void;
  onHideForm: () => void;
  onCreateTab: () => void;
}

const CreateTabForm: React.FC<CreateTabFormProps> = ({
  newTabName,
  showCreateForm,
  onNewTabNameChange,
  onShowForm,
  onHideForm,
  onCreateTab
}) => (
  <div className={`mb-8 overflow-hidden ${
    showCreateForm 
      ? 'border border-[--foreground]/20 rounded-lg bg-[--background] p-4 transition-all duration-300' 
      : 'transition-none'
  }`}>
    {!showCreateForm ? (
      <div className="inline-block border border-[--foreground]/20 rounded-lg bg-[--background] px-2 py-1">
        <button
          onClick={onShowForm}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm whitespace-nowrap"
        >
          + Create New Tab
        </button>
      </div>
    ) : (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Create New Tab</h3>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={newTabName}
            onChange={(e) => onNewTabNameChange(e.target.value)}
            placeholder="Enter tab name..."
            className="flex-1 px-3 py-2 border border-[--foreground]/30 rounded-md bg-[--background] text-[--foreground] focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && onCreateTab()}
            autoFocus
          />
          <button
            onClick={onCreateTab}
            disabled={!newTabName.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Tab
          </button>
          <button
            onClick={onHideForm}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
);

interface TabHeaderProps {
  tab: CustomTab;
  isSelected: boolean;
  onSelect: (tabId: string) => void;
  onStartRenaming: (tabId: string) => void;
  onSaveName: (tabId: string, newName: string) => void;
  onCancelRenaming: (tabId: string) => void;
  showRenameButtons: boolean;
}

const TabHeader: React.FC<TabHeaderProps> = ({ tab, isSelected, onSelect, onStartRenaming, onSaveName, onCancelRenaming, showRenameButtons }) => {
  const [editName, setEditName] = useState(tab.name);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSaveName(tab.id, editName);
    } else if (e.key === 'Escape') {
      onCancelRenaming(tab.id);
      setEditName(tab.name);
    }
  };

  if (tab.isRenaming) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={handleKeyPress}
          onBlur={() => onSaveName(tab.id, editName)}
          className="px-3 py-2 rounded-md border border-blue-500 bg-[--background] text-[--foreground] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          autoFocus
        />
        <button
          onClick={() => onSaveName(tab.id, editName)}
          className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
        >
          ✓
        </button>
        <button
          onClick={() => {
            onCancelRenaming(tab.id);
            setEditName(tab.name);
          }}
          className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onSelect(tab.id)}
        className={`px-3 py-2 rounded-md border transition-colors ${
          isSelected
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-[--background] text-[--foreground] border-[--foreground]/30 hover:border-[--foreground]/50'
        }`}
      >
        {tab.name}
      </button>
      
      {/* Rename button - only shows when global toggle is active */}
      {showRenameButtons && (
        <button
          onClick={() => onStartRenaming(tab.id)}
          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
          title="Rename tab"
        >
          ✏️
        </button>
      )}
    </div>
  );
};

interface TabContentProps {
  tab: CustomTab;
  isEditing: boolean;
  editingContent: string;
  onEditContentChange: (content: string) => void;
  onStartEditing: () => void;
  onSaveContent: () => void;
  onCancelEditing: () => void;
  onDeleteTab: () => void;
}

const TabContent: React.FC<TabContentProps> = ({
  tab,
  isEditing,
  editingContent,
  onEditContentChange,
  onStartEditing,
  onSaveContent,
  onCancelEditing,
  onDeleteTab
}) => {
  // Show editing mode if actively editing OR if tab has no content (new tab)
  const shouldShowEditMode = isEditing || !tab.content;
  
  return (
    <div className="border border-[--foreground]/20 rounded-lg p-4 bg-[--background]">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium">{tab.name}</h4>
        <div className="flex gap-2">
          {tab.content && !isEditing && (
            <button
              onClick={onStartEditing}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Edit Content
            </button>
          )}
          <button
            onClick={onDeleteTab}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      
      {shouldShowEditMode ? (
      <div className="space-y-3">
        <textarea
          value={editingContent}
          onChange={(e) => onEditContentChange(e.target.value)}
          placeholder="Enter tab content..."
          rows={6}
          className="w-full px-3 py-2 border border-[--foreground]/30 rounded-md bg-[--background] text-[--foreground] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
        />
        <div className="flex gap-2">
          <button
            onClick={onSaveContent}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={onCancelEditing}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <div className="space-y-4">
        <div className="min-h-[120px] p-3 bg-[--foreground]/5 rounded border border-[--foreground]/10">
          {tab.content ? (
            <p className="whitespace-pre-wrap">{tab.content}</p>
          ) : (
            <p className="text-[--foreground]/60 italic">No content yet. Click &quot;Edit Content&quot; to add some!</p>
          )}
        </div>
        

      </div>
    )}
    </div>
  );
};

export default function OverviewTab({ 
  onNewTabCreated, 
  customTabs, 
  onDeleteCustomTab, 
  onUpdateCustomTab,
  onStartRenamingTab,
  onSaveTabName,
  onCancelRenamingTab
}: OverviewTabProps): JSX.Element {
  // State to control when rename buttons are visible
  const [showRenameButtons, setShowRenameButtons] = useState(false);

  // Custom hooks
  const {
    newTabName,
    showCreateForm,
    handleCreateTab,
    showForm,
    hideForm,
    updateTabName
  } = useTabForm((newTab) => {
    onNewTabCreated(newTab);
    // Automatically select the newly created tab and start editing
    selectTab(newTab.id);
    startEditing(newTab);
  });

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

  // Code generation - handle per-tab generated code
  const {
    generatedCode,
    isGenerating,
    generateCode,
    clearGeneratedCode,
    copyToClipboard
  } = useCodeGeneration((tabId, code) => {
    // Save generated code to the specific tab
    const tabToUpdate = customTabs.find(tab => tab.id === tabId);
    if (tabToUpdate) {
      onUpdateCustomTab({ ...tabToUpdate, generatedCode: code });
    }
  });

  // Generate code for all tabs
  const generateAllTabsCode = () => {
    if (customTabs.length > 0) {
      const allTabsContent = customTabs.map(tab => ({
        name: tab.name,
        content: tab.content || 'No content'
      }));
      
      // Generate code with all tabs information
      generateCode(JSON.stringify(allTabsContent, null, 2), 'Custom Tabs Collection');
    }
  };

  return (
    <div id="tabs" className="text-[--foreground] p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Custom Tab Creator</h2>
      </div>
      
      {/* Create New Tab Form and Generate Code Button */}
      <div className="flex items-center gap-4 mb-8">
        <CreateTabForm
          newTabName={newTabName}
          showCreateForm={showCreateForm}
          onNewTabNameChange={updateTabName}
          onShowForm={showForm}
          onHideForm={hideForm}
          onCreateTab={handleCreateTab}
        />
        
        {/* Toggle Rename Buttons */}
        {customTabs.length > 0 && (
          <button
            onClick={() => setShowRenameButtons(!showRenameButtons)}
            className={`px-4 py-2 rounded-md transition-colors font-medium ${
              showRenameButtons 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
            title={showRenameButtons ? "Hide rename buttons" : "Show rename buttons"}
          >
            {showRenameButtons ? "🔒 Hide Rename" : "✏️ Show Rename"}
          </button>
        )}
        
        {/* Common Generate Code Button */}
        {customTabs.length > 0 && (
          <button
            onClick={() => generateAllTabsCode()}
            disabled={isGenerating}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isGenerating ? "🔄 Generating..." : "🚀 Generate All Tabs Code"}
          </button>
        )}
      </div>

      {/* Custom Tabs Display */}
      {customTabs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Your Custom Tabs</h3>
          
          {/* Tab Headers */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {customTabs.map((tab) => (
              <TabHeader
                key={tab.id}
                tab={tab}
                isSelected={selectedCustomTabId === tab.id}
                onSelect={selectTab}
                onStartRenaming={onStartRenamingTab}
                onSaveName={onSaveTabName}
                onCancelRenaming={onCancelRenamingTab}
                showRenameButtons={showRenameButtons}
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
                onEditContentChange={updateEditingContent}
                onStartEditing={() => startEditing(selectedTab)}
                onSaveContent={() => saveContent(selectedTab)}
                onCancelEditing={cancelEditing}
                onDeleteTab={() => onDeleteCustomTab(selectedTab.id)}
              />
            );
          })()}
        </div>
      )}

      {customTabs.length === 0 && (
        <div className="text-center py-8 text-[--foreground]/60">
          <p className="text-lg">No custom tabs created yet.</p>
          <p className="text-sm">Create your first tab above!</p>
        </div>
      )}

      {/* Generated Code Output - Show below custom tabs */}
      {generatedCode && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-[--foreground]">Generated Code</h3>
          <CodeOutput
            generatedCode={generatedCode}
            onClear={clearGeneratedCode}
            onCopy={copyToClipboard}
          />
        </div>
      )}
    </div>
  );
}


