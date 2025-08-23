import { CustomTab } from "./useCustomTabs";
import { useCodeGeneration } from "./useCodeGeneration";

export function useTabActions(
  customTabs: CustomTab[],
  onUpdateCustomTab: (updatedTab: CustomTab) => void
) {
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

  return {
    generatedCode,
    isGenerating,
    generateAllTabsCode,
    clearGeneratedCode,
    copyToClipboard
  };
}
