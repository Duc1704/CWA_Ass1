"use client";

import React, { useState } from "react";

interface CustomTab {
  id: string;
  name: string;
  content: string;
}

interface OverviewTabProps {
  onNewTabCreated: (newTab: CustomTab) => void;
  customTabs: CustomTab[];
  onDeleteCustomTab: (tabId: string) => void;
  onUpdateCustomTab: (updatedTab: CustomTab) => void;
}

export default function OverviewTab({ onNewTabCreated, customTabs, onDeleteCustomTab, onUpdateCustomTab }: OverviewTabProps): JSX.Element {
  const [newTabName, setNewTabName] = useState<string>("");
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [selectedCustomTabId, setSelectedCustomTabId] = useState<string | null>(null);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");

  const handleCreateTab = () => {
    if (newTabName.trim()) {
      const newTab: CustomTab = {
        id: `custom-${Date.now().toString()}`,
        name: newTabName.trim(),
        content: ""
      };
      onNewTabCreated(newTab);
      setNewTabName("");
      setShowCreateForm(false);
    }
  };

  const cancelCreateForm = () => {
    setShowCreateForm(false);
    setNewTabName("");
  };

  const handleEditContent = (tabId: string, content: string) => {
    // Update the tab content through parent component
    const updatedTab = customTabs.find(tab => tab.id === tabId);
    if (updatedTab) {
      onUpdateCustomTab({ ...updatedTab, content });
    }
  };

<<<<<<< Updated upstream
  const startEditing = (tab: CustomTab) => {
    setEditingTabId(tab.id);
    setEditingContent(tab.content);
  };

  const saveContent = () => {
    if (editingTabId) {
      handleEditContent(editingTabId, editingContent);
      setEditingTabId(null);
      setEditingContent("");
    }
  };

  const cancelEditing = () => {
    setEditingTabId(null);
    setEditingContent("");
  };

  return (
    <div id="tabs" className="text-[--foreground] p-6">
      <h2 className="text-2xl font-bold mb-6">Custom Tab Creator</h2>
      
      {/* Create New Tab Section */}
      <div className={`mb-8 overflow-hidden ${
        showCreateForm 
          ? 'border border-[--foreground]/20 rounded-lg bg-[--background] p-4 transition-all duration-300' 
          : 'transition-none'
      }`}>
        {!showCreateForm ? (
          <div className="inline-block border border-[--foreground]/20 rounded-lg bg-[--background] px-2 py-1">
            <button
              onClick={() => setShowCreateForm(true)}
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
                onChange={(e) => setNewTabName(e.target.value)}
                placeholder="Enter tab name..."
                className="flex-1 px-3 py-2 border border-[--foreground]/30 rounded-md bg-[--background] text-[--foreground] focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === "Enter" && handleCreateTab()}
                autoFocus
              />
              <button
                onClick={handleCreateTab}
                disabled={!newTabName.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Tab
              </button>
              <button
                onClick={cancelCreateForm}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
=======
interface TabContentProps {
  tab: CustomTab;
  isEditing: boolean;
  editingContent: string;
  onEditContentChange: (content: string) => void;
  onStartEditing: () => void;
  onSaveContent: () => void;
  onCancelEditing: () => void;
  onDeleteTab: () => void;
  onGenerateCode: (content: string, title: string, tabId: string) => void;
  isGenerating: boolean;
  generatingTabId: string | null;
}

const TabContent: React.FC<TabContentProps> = ({
  tab,
  isEditing,
  editingContent,
  onEditContentChange,
  onStartEditing,
  onSaveContent,
  onCancelEditing,
  onDeleteTab,
  onGenerateCode,
  isGenerating,
  generatingTabId
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
        
        {/* Code Generation Section */}
        {tab.content && (
          <div className="border border-[--foreground]/20 rounded-lg p-4 bg-[--foreground]/5">
            <h4 className="text-lg font-medium mb-3 text-[--foreground]">Generate Code</h4>
            <div className="space-y-3">
              <p className="text-sm text-[--foreground]/70 mb-2">
                Page title will be: <strong>{tab.name}</strong>
              </p>
              <button
                onClick={() => onGenerateCode(tab.content, tab.name, tab.id)}
                disabled={isGenerating && generatingTabId === tab.id}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {(isGenerating && generatingTabId === tab.id) ? "🔄 Generating..." : "🚀 Generate HTML + CSS + JS"}
>>>>>>> Stashed changes
              </button>
            </div>
          </div>
        )}
      </div>
<<<<<<< Updated upstream
=======
    )}
    </div>
  );
};

export default function OverviewTab({ 
  onNewTabCreated, 
  customTabs, 
  onDeleteCustomTab, 
  onUpdateCustomTab
}: OverviewTabProps): JSX.Element {
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
    isGenerating,
    generatingTabId,
    generateCode,
    copyToClipboard
  } = useCodeGeneration((tabId, code) => {
    // Save generated code to the specific tab
    const tabToUpdate = customTabs.find(tab => tab.id === tabId);
    if (tabToUpdate) {
      onUpdateCustomTab({ ...tabToUpdate, generatedCode: code });
    }
  });

  return (
    <div id="tabs" className="text-[--foreground] p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Custom Tab Creator</h2>
      </div>
      
      {/* Create New Tab Form */}
      <CreateTabForm
        newTabName={newTabName}
        showCreateForm={showCreateForm}
        onNewTabNameChange={updateTabName}
        onShowForm={showForm}
        onHideForm={hideForm}
        onCreateTab={handleCreateTab}
      />
>>>>>>> Stashed changes

      {/* Custom Tabs Display */}
      {customTabs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Your Custom Tabs</h3>
          
          {/* Tab Headers */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {customTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCustomTabId(selectedCustomTabId === tab.id ? null : tab.id)}
                className={`px-3 py-2 rounded-md border transition-colors ${
                  selectedCustomTabId === tab.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-[--background] text-[--foreground] border-[--foreground]/30 hover:border-[--foreground]/50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Content Area */}
<<<<<<< Updated upstream
          {selectedCustomTabId && (
            <div className="border border-[--foreground]/20 rounded-lg p-4 bg-[--background]">
              {(() => {
                const selectedTab = customTabs.find(tab => tab.id === selectedCustomTabId);
                if (!selectedTab) return null;
                
                return (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium">{selectedTab.name}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(selectedTab)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Edit Content
                        </button>
                        <button
                          onClick={() => onDeleteCustomTab(selectedTab.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    {editingTabId === selectedTab.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          placeholder="Enter tab content..."
                          rows={6}
                          className="w-full px-3 py-2 border border-[--foreground]/30 rounded-md bg-[--background] text-[--foreground] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveContent}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="min-h-[120px] p-3 bg-[--foreground]/5 rounded border border-[--foreground]/10">
                        {selectedTab.content ? (
                          <p className="whitespace-pre-wrap">{selectedTab.content}</p>
                        ) : (
                          <p className="text-[--foreground]/60 italic">No content yet. Click &quot;Edit Content&quot; to add some!</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
=======
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
                onGenerateCode={generateCode}
                isGenerating={isGenerating}
                generatingTabId={generatingTabId}
              />
            );
          })()}
>>>>>>> Stashed changes
        </div>
      )}

      {customTabs.length === 0 && (
        <div className="text-center py-8 text-[--foreground]/60">
          <p className="text-lg">No custom tabs created yet.</p>
          <p className="text-sm">Create your first tab above!</p>
        </div>
      )}
<<<<<<< Updated upstream
=======

      {/* Generated Code Output - Show code for currently selected tab */}
      {selectedCustomTabId && (() => {
        const selectedTab = customTabs.find(tab => tab.id === selectedCustomTabId);
        if (selectedTab?.generatedCode) {
          return (
            <CodeOutput
              generatedCode={{ fullCode: selectedTab.generatedCode }}
              onClear={() => {
                // Clear generated code for this specific tab
                onUpdateCustomTab({ ...selectedTab, generatedCode: undefined });
              }}
              onCopy={copyToClipboard}
            />
          );
        }
        return null;
      })()}
>>>>>>> Stashed changes
    </div>
  );
}


