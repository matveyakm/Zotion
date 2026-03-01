import { uiCSS, mainPanelStyle } from '../CSS';
import { panelHTML } from './mainPanelHTML';

let panelElement: HTMLElement | null = null;
let uiInjected = false;

function createPanel() {
    if (panelElement) return panelElement;
  
    if (!document.getElementById('zot-main-panel')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'zot-main-panel';
      styleTag.textContent = uiCSS;
      document.head.appendChild(styleTag);
    }
  
    panelElement = document.createElement('div');
    panelElement.id = 'zot-main-panel';
    panelElement.innerHTML = panelHTML;
    panelElement.style.cssText = mainPanelStyle;
  
    document.body.appendChild(panelElement);
  
    
  
    return panelElement;
}


export function initMainPanel() {
    if (uiInjected) return;
  
    console.log('Panel: init main panel');
  
    const panel = createPanel();
    panel.style.display = 'block';
  
    uiInjected = true;
}