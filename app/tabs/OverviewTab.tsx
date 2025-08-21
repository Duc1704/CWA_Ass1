"use client";

import React, { useState, useEffect } from "react";

interface CustomTab {
  id: string;
  name: string;
  content: string;
}

export default function OverviewTab(): JSX.Element {
  const [customTabs, setCustomTabs] = useState<CustomTab[]>([]);
  const [newTabName, setNewTabName] = useState<string>("");
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");

  // Load custom tabs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("customTabs");
    if (saved) {
      try {
        setCustomTabs(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse saved tabs:", error);
      }
    }
  }, []);

  // Save custom tabs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("customTabs", JSON.stringify(customTabs));
  }, [customTabs]);

  const handleCreateTab = () => {
    if (newTabName.trim()) {
      const newTab: CustomTab = {
        id: Date.now().toString(),
        name: newTabName.trim(),
        content: ""
      };
      setCustomTabs(prev => [...prev, newTab]);
      setNewTabName("");
    }
  };

  const handleDeleteTab = (tabId: string) => {
    setCustomTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (editingTabId === tabId) {
      setEditingTabId(null);
      setEditingContent("");
    }
  };

  const handleEditContent = (tabId: string, content: string) => {
    setCustomTabs(prev => 
      prev.map(tab => 
        tab.id === tabId ? { ...tab, content } : tab
      )
    );
  };

  const startEditing = (tab: CustomTab) => {
    setEditingTabId(tab.id);
    setEditingContent(tab.content);
  };

  const saveContent = (tabId: string) => {
    handleEditContent(tabId, editingContent);
    setEditingTabId(null);
    setEditingContent("");
  };

  const cancelEditing = () => {
    setEditingTabId(null);
    setEditingContent("");
  };

  return (
    <div id="tabs" className="text-[--foreground] p-6">
      <h2 className="text-2xl font-bold mb-6">Custom Tab Creator</h2>
      
      {/* Create New Tab Section */}
      <div className="mb-8 p-4 border border-[--foreground]/20 rounded-lg bg-[--background]">
        <h3 className="text-lg font-semibold mb-4">Create New Tab</h3>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={newTabName}
            onChange={(e) => setNewTabName(e.target.value)}
            placeholder="Enter tab name..."
            className="flex-1 px-3 py-2 border border-[--foreground]/30 rounded-md bg-[--background] text-[--foreground] focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && handleCreateTab()}
          />
          <button
            onClick={handleCreateTab}
            disabled={!newTabName.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Create Tab
          </button>
        </div>
      </div>

      {/* Display Custom Tabs */}
      {customTabs.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Custom Tabs</h3>
          {customTabs.map((tab) => (
            <div key={tab.id} className="p-4 border border-[--foreground]/20 rounded-lg bg-[--background]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-medium text-blue-600">{tab.name}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(tab)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Edit Content
                  </button>
                  <button
                    onClick={() => handleDeleteTab(tab.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {editingTabId === tab.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    placeholder="Enter tab content..."
                    rows={4}
                    className="w-full px-3 py-2 border border-[--foreground]/30 rounded-md bg-[--background] text-[--foreground] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveContent(tab.id)}
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
                <div className="min-h-[60px] p-3 bg-[--foreground]/5 rounded border border-[--foreground]/10">
                  {tab.content ? (
                    <p className="whitespace-pre-wrap">{tab.content}</p>
                  ) : (
                    <p className="text-[--foreground]/60 italic">No content yet. Click &quot;Edit Content&quot; to add some!</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-[--foreground]/60">
          <p className="text-lg">No custom tabs created yet.</p>
          <p className="text-sm">Create your first tab above!</p>
        </div>
      )}
    </div>
  );
}


