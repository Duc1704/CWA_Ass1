"use client";

import React from "react";
import { CustomTab } from "../../hooks";
import EditContent from "./EditContent";

interface TabContentProps {
  tab: CustomTab;
  isEditing: boolean;
  editingContent: string;
  onEditContentChange: (content: string) => void;
  onStartEditing: () => void;
  onSaveContent: () => void;
  onCancelEditing: () => void;
}

const TabContent: React.FC<TabContentProps> = ({
  tab,
  isEditing,
  editingContent,
  onEditContentChange,
  onStartEditing,
  onSaveContent,
  onCancelEditing
}) => {
  // Show editing mode if actively editing OR if tab has no content (new tab)
  const shouldShowEditMode = isEditing || !tab.content;
  
  return (
    <div className="border border-[--foreground]/20 rounded-b-lg rounded-tr-lg p-6 bg-[--background] shadow-sm">
      {/* Action buttons at the top right */}
      <div className="flex justify-end gap-2 mb-4">
        <EditContent
          onStartEditing={onStartEditing}
          hasContent={!!tab.content}
          isEditing={isEditing}
        />
      </div>
      
      {shouldShowEditMode ? (
        <div className="space-y-4">
          <textarea
            value={editingContent}
            onChange={(e) => onEditContentChange(e.target.value)}
            placeholder="Enter your content here..."
            rows={8}
            className="w-full px-4 py-3 border border-[--foreground]/30 rounded-md bg-[--background] text-[--foreground] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical text-sm"
          />
          <div className="flex gap-3">
            <button
              onClick={onSaveContent}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              Save
            </button>
            <button
              onClick={onCancelEditing}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="min-h-[120px] p-4 bg-[--foreground]/5 rounded border border-[--foreground]/10">
          {tab.content ? (
            <p className="whitespace-pre-wrap text-[--foreground]">{tab.content}</p>
          ) : (
            <p className="text-[--foreground]/60 italic">No content yet. Click &quot;Edit Content&quot; to add some!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TabContent;
