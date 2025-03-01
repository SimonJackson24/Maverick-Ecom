// Add this script to your page temporarily to debug layout issues
(function debugLayout() {
  // Add colored overlays to all flex containers
  const addDebugStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .debug-overlay {
        position: fixed;
        background: rgba(255, 0, 0, 0.2);
        z-index: 9999;
        pointer-events: none;
      }
      
      .debug-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 4px;
        border: 1px solid red;
      }
    `;
    document.head.appendChild(style);
  };

  const createOverlay = (element, index) => {
    const rect = element.getBoundingClientRect();
    const overlay = document.createElement('div');
    overlay.className = 'debug-overlay';
    overlay.style.top = rect.top + 'px';
    overlay.style.left = rect.left + 'px';
    overlay.style.width = rect.width + 'px';
    overlay.style.height = rect.height + 'px';
    
    const text = document.createElement('div');
    text.className = 'debug-text';
    text.textContent = `
      Element ${index}
      Classes: ${element.className}
      Width: ${rect.width}px
      Margin: ${getComputedStyle(element).margin}
      Padding: ${getComputedStyle(element).padding}
    `;
    overlay.appendChild(text);
    
    document.body.appendChild(overlay);
  };

  const debugLayoutStructure = () => {
    addDebugStyles();
    
    // Find all flex containers
    const flexContainers = Array.from(document.querySelectorAll('*')).filter(el => {
      const style = window.getComputedStyle(el);
      return style.display === 'flex';
    });
    
    // Create overlays for each container
    flexContainers.forEach((container, index) => {
      createOverlay(container, index);
    });
    
    console.log('Layout debug overlays added. Check the red highlighted areas.');
  };

  // Run the debug function
  debugLayoutStructure();
})();
