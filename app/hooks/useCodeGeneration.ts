import { useState, useCallback } from "react";

export interface GeneratedCode {
  fullCode: string;
}

export function useCodeGeneration(onCodeGenerated?: (tabId: string, generatedCode: string) => void) {
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingTabId, setGeneratingTabId] = useState<string | null>(null);

  const generateCode = useCallback((content: string, title: string = "Generated Page", tabId?: string) => {
    setIsGenerating(true);
    setGeneratingTabId(tabId || null);
    
    // Simulate generation time
    setTimeout(() => {
      const javascript = generateJavaScript();
      const fullCode = generateFullCodeWithInlineCSS(content, title, javascript);
      
      setGeneratedCode({
        fullCode
      });
      
      // Notify parent component about generated code if callback provided
      if (onCodeGenerated && tabId) {
        onCodeGenerated(tabId, fullCode);
      }
      
      setIsGenerating(false);
      setGeneratingTabId(null);
    }, 1000);
  }, [onCodeGenerated]);

  const clearGeneratedCode = useCallback(() => {
    setGeneratedCode(null);
  }, []);

  const copyToClipboard = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  }, []);

  return {
    generatedCode,
    isGenerating,
    generatingTabId,
    generateCode,
    clearGeneratedCode,
    copyToClipboard
  };
}

// Helper functions to generate code



function generateJavaScript(): string {
  return `// Generated JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Generated page loaded successfully!');
    
    // Tab switching functionality
    window.switchTab = function(tabIndex) {
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.style.display = 'none';
            content.style.opacity = '0';
            content.style.transform = 'translateY(10px)';
        });
        
        // Remove active state from all tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.style.background = '#f0f0f0';
            button.style.color = '#333';
            button.style.fontWeight = 'normal';
            button.style.transform = 'translateY(0)';
        });
        
        // Show selected tab content with animation
        const selectedContent = document.getElementById('tab-' + tabIndex);
        if (selectedContent) {
            selectedContent.style.display = 'block';
            setTimeout(() => {
                selectedContent.style.opacity = '1';
                selectedContent.style.transform = 'translateY(0)';
            }, 50);
        }
        
        // Highlight selected tab button with animation
        const selectedButton = document.querySelector('[data-tab="' + tabIndex + '"]');
        if (selectedButton) {
            selectedButton.style.background = '#667eea';
            selectedButton.style.color = 'white';
            selectedButton.style.fontWeight = 'bold';
            selectedButton.style.transform = 'translateY(-2px)';
        }
    };
    
    // Add fade-in animation to content
    const content = document.querySelector('main div');
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        content.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 300);
    }





    // Add smooth scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑ Top';
    scrollTopBtn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; padding: 10px 15px; background: rgba(102, 126, 234, 0.9); color: white; border: none; border-radius: 25px; cursor: pointer; font-size: 14px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); transition: all 0.3s ease; z-index: 1000;';
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    scrollTopBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(102, 126, 234, 1)';
        this.style.transform = 'translateY(-2px)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(102, 126, 234, 0.9)';
        this.style.transform = 'translateY(0)';
    });
    
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Initialize scroll button as hidden
    scrollTopBtn.style.opacity = '0';
    scrollTopBtn.style.visibility = 'hidden';
});`;
}

function generateFullCodeWithInlineCSS(content: string, title: string, javascript: string): string {
  // Check if content is JSON (multiple tabs) or regular content
  let isMultipleTabs = false;
  let tabsData: Array<{name: string, content: string}> = [];
  
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name && parsed[0].content !== undefined) {
      isMultipleTabs = true;
      tabsData = parsed;
    }
  } catch {
    // Not JSON, treat as regular content
  }

  let processedContent = '';
  
  if (isMultipleTabs) {
    // Generate browser-like tabs interface
    const tabsHTML = tabsData.map((tab, index) => `
      <div class="tab-content" id="tab-${index}" style="display: ${index === 0 ? 'block' : 'none'}; padding: 20px; background: rgba(255, 255, 255, 0.95); border-radius: 8px; margin-top: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; opacity: ${index === 0 ? '1' : '0'}; transform: ${index === 0 ? 'translateY(0)' : 'translateY(10px)'};">
        <h3 style="margin-bottom: 15px; color: #333; font-size: 1.5rem; border-bottom: 2px solid #667eea; padding-bottom: 10px;">${tab.name}</h3>
        <div style="color: #444; line-height: 1.6;">
          ${tab.content.split('\n').map(line => 
            `<p style="margin-bottom: 15px; padding: 10px; background: rgba(255, 255, 255, 0.8); border-radius: 6px; border-left: 3px solid #667eea;">${line}</p>`
          ).join('\n          ')}
        </div>
      </div>
    `).join('\n      ');

    const tabButtonsHTML = tabsData.map((tab, index) => `
      <button 
        class="tab-button" 
        data-tab="${index}" 
        style="padding: 10px 20px; margin-right: 5px; border: none; background: ${index === 0 ? '#667eea' : '#f0f0f0'}; color: ${index === 0 ? 'white' : '#333'}; border-radius: 8px 8px 0 0; cursor: pointer; transition: all 0.3s ease; font-weight: ${index === 0 ? 'bold' : 'normal'}; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);"
        onclick="switchTab(${index})"
      >
        ${tab.name}
      </button>
    `).join('\n        ');

    processedContent = `
      <div style="margin-bottom: 20px;">
        <div class="tab-buttons" style="border-bottom: 2px solid #ddd; margin-bottom: 0; padding: 0 10px;">
          ${tabButtonsHTML}
        </div>
        ${tabsHTML}
      </div>
    `;
  } else {
    // Regular single content processing
    if (content && content.trim()) {
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        processedContent = lines.map(line => 
          `<p style="margin-bottom: 20px; color: #444; padding: 15px; background: rgba(255, 255, 255, 0.8); border-radius: 8px; border-left: 4px solid #667eea;">${line}</p>`
        ).join('\n                ');
      } else {
        processedContent = `<p style="margin-bottom: 20px; color: #444; padding: 15px; background: rgba(255, 255, 255, 0.8); border-radius: 8px; border-left: 4px solid #667eea;">${content}</p>`;
      }
    } else {
      processedContent = '<p style="margin-bottom: 20px; color: #666; font-style: italic; text-align: center;">No content provided</p>';
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
        <header style="text-align: center; margin-bottom: 40px; padding: 30px 0; background: rgba(255, 255, 255, 0.1); border-radius: 15px; backdrop-filter: blur(10px);">
            <h1 style="font-size: 2.5rem; color: white; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); margin-bottom: 10px;">${title}</h1>
        </header>
        <main style="background: rgba(255, 255, 255, 0.95); border-radius: 15px; padding: 40px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);">
            <div style="font-size: 1.1rem; line-height: 1.8;">
                ${processedContent}
            </div>
        </main>
    </div>
    <script>
${javascript}
    </script>
</body>
</html>`;
}

