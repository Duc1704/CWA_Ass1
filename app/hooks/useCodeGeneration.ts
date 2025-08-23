import { useState, useCallback } from "react";

export interface GeneratedCode {
  fullCode: string;
}

export function useCodeGeneration() {
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCode = useCallback((content: string, title: string = "Generated Page") => {
    setIsGenerating(true);
    
    // Simulate generation time
    setTimeout(() => {
      const javascript = generateJavaScript();
      const fullCode = generateFullCodeWithInlineCSS(content, title, javascript);
      
      setGeneratedCode({
        fullCode
      });
      setIsGenerating(false);
    }, 1000);
  }, []);

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
    generateCode,
    clearGeneratedCode,
    copyToClipboard
  };
}

// Helper functions to generate code



function generateJavaScript(): string {
  return `// Generated JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

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

    // Add interactive hover effects
    const paragraphs = document.querySelectorAll('main p');
    paragraphs.forEach(p => {
        p.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        p.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Add click counter
    let clickCount = 0;
    const title = document.querySelector('h1');
    if (title) {
        title.addEventListener('click', function() {
            clickCount++;
            this.textContent = \`\${this.textContent} (Clicked \${clickCount}x)\`;
        });
    }

    console.log('Generated page loaded successfully!');
});`;
}

function generateFullCodeWithInlineCSS(content: string, title: string, javascript: string): string {
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
        <main style="background: rgba(255, 255, 255, 0.95); border-radius: 15px; padding: 40px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); margin-bottom: 30px;">
            <div style="font-size: 1.1rem; line-height: 1.8;">
                ${content.split('\n').map(line => `<p style="margin-bottom: 20px; color: #444;">${line}</p>`).join('\n                ')}
            </div>
        </main>
        <footer style="text-align: center; padding: 20px; background: rgba(255, 255, 255, 0.1); border-radius: 15px; backdrop-filter: blur(10px);">
            <p style="color: white; font-size: 0.9rem;">&copy; 2024 Generated Page</p>
        </footer>
    </div>
    <script>
${javascript}
    </script>
</body>
</html>`;
}
