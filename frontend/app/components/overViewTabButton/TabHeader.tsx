"use client";

import React, { useState } from "react";
import { CustomTab } from "../../hooks";
import Button from "../Button";

interface TabHeaderProps {
  tab: CustomTab;
  isSelected: boolean;
  onSelect: (tabId: string) => void;
  onStartRenaming: (tabId: string) => void;
  onSaveName: (tabId: string, newName: string) => void;
  onCancelRenaming: (tabId: string) => void;
  showRenameButtons: boolean;
  showDeleteButtons: boolean;
  onDeleteTab: (tabId: string) => void;
}

const TabHeader: React.FC<TabHeaderProps> = ({ 
  tab, 
  isSelected, 
  onSelect, 
  onStartRenaming, 
  onSaveName, 
  onCancelRenaming, 
  showRenameButtons, 
  showDeleteButtons, 
  onDeleteTab 
}) => {
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
        <Button
          onClick={() => onSaveName(tab.id, editName)}
          variant="success"
          size="sm"
        >
          Save
        </Button>
        <Button
          onClick={() => {
            onCancelRenaming(tab.id);
            setEditName(tab.name);
          }}
          variant="secondary"
          size="sm"
        >
          Cancel
        </Button>
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
      
      {/* Edit button - only shows when global toggle is active */}
      {showRenameButtons && (
        <Button
          onClick={() => onStartRenaming(tab.id)}
          variant="primary"
          size="sm"
          title="Edit Tab Heading"
        >
          Edit
        </Button>
      )}
      
      {/* Delete button - only shows when global toggle is active */}
      {showDeleteButtons && (
        <Button
          onClick={() => onDeleteTab(tab.id)}
          variant="danger"
          size="sm"
          title="Delete Tab"
        >
          Delete
        </Button>
      )}
    </div>
  );
};

export default TabHeader;
