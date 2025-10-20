import React, { useState } from 'react';
import Button from '../Button';

interface CreateNewTabProps {
  onNewTabCreated: (newTab: { id: string; name: string; content: string; createdAt: string }) => void;
  onSelectTab: (tabId: string) => void;
  onStartEditing: (tab: { id: string; name: string; content: string; createdAt: string }) => void;
}

const CreateNewTab: React.FC<CreateNewTabProps> = ({
  onNewTabCreated,
  onSelectTab,
  onStartEditing
}) => {
  const [newTabHeading, setNewTabHeading] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleAddTab = () => {
    if (newTabHeading.trim()) {
      const newTab = {
        id: Date.now().toString(),
        name: newTabHeading.trim(),
        content: '',
        createdAt: new Date().toISOString()
      };
      onNewTabCreated(newTab);
      setNewTabHeading('');
      setShowCreateForm(false);
      onSelectTab(newTab.id);
      onStartEditing(newTab);
    }
  };

  const handleCancel = () => {
    setNewTabHeading('');
    setShowCreateForm(false);
  };

  const handleShowForm = () => {
    setShowCreateForm(true);
  };

  return (
    <div className={`overflow-hidden ${
      showCreateForm 
        ? 'border border-[--foreground]/20 rounded-lg bg-[--background] p-4 transition-all duration-300' 
        : 'transition-none'
    }`}>
      {!showCreateForm ? (
        <Button
          onClick={handleShowForm}
          variant="primary"
          size="md"
          className="w-full sm:w-auto"
        >
          Create New Tab
        </Button>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Create New Tab</h3>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={newTabHeading}
              onChange={(e) => setNewTabHeading(e.target.value)}
              placeholder="Enter tab name..."
              className="w-full sm:w-auto sm:flex-1 px-3 py-2 border border-[--foreground]/30 rounded-md bg-[--background] text-[--foreground] focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && handleAddTab()}
              autoFocus
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 w-full sm:w-auto">
              <Button
                onClick={handleAddTab}
                disabled={!newTabHeading.trim()}
                variant="success"
                size="sm"
                className="w-full sm:w-auto"
              >
                Create
              </Button>
              <Button
                onClick={handleCancel}
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNewTab;
