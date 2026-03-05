import { uiCSS, mainPanelStyle } from '../CSS';
import { panelHTML } from './mainPanelHTML';
import { showTextPanel, hideTextPanel } from '../textPanel/textPanel';
import { showBlockPanel, hideBlockPanel } from '../blockPanel/blockPanel';

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
    
    const buttons = panelElement.querySelectorAll('.zot-main-panel-button');
    const activeClass = 'zot-main-panel-button-active';

    buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value');
        if (value !== null) {
            if (btn.classList.contains(activeClass)) {
                btn.classList.remove(activeClass);
                if (value === 'text') {
                    hideTextPanel();
                } else {
                    hideBlockPanel();
                }
            } else {
                buttons.forEach(b => b.classList.remove(activeClass));
                btn.classList.add(activeClass);
                if (value === 'text') {
                    hideBlockPanel();
                    showTextPanel();
                }
                if (value === 'block') {
                    hideTextPanel();
                    showBlockPanel();
                }
            } 
        } 
    });
    });
    
  
    return panelElement;
}


export function initMainPanel() {
    if (uiInjected) return;
  
    console.log('Panel: init main panel');
  
    const panel = createPanel();
    panel.style.display = 'block';
  
    uiInjected = true;
}