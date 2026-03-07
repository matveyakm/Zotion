import { uiCSS, timerMainPanelStyle } from '../CSS';

let panelElement: HTMLElement | null = null;
let uiInjected = false;

const panelHTML = `
    <button title="Таймер" class="zot-main-panel-button" style="width:44px; height:44px; padding: 0">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 11px 9px;">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    </button>
`;

function createPanel() {
    if (panelElement) return panelElement;
  
    if (!document.getElementById('zot-timer-main-panel')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'zot-timer-main-panel';
      styleTag.textContent = uiCSS;
      document.head.appendChild(styleTag);
    }
  
    panelElement = document.createElement('div');
    panelElement.id = 'zot-timer-main-panel';
    panelElement.innerHTML = panelHTML;
    panelElement.style.cssText = timerMainPanelStyle;
  
    document.body.appendChild(panelElement);
    
    const button = panelElement.querySelector('.zot-main-panel-button') as HTMLButtonElement;
    button.addEventListener('click', () => {
        if (button.classList.contains('zot-main-panel-button-active')) {
            button.classList.remove('zot-main-panel-button-active');
        } else {
            button.classList.add('zot-main-panel-button-active');
        }
    });
  
    return panelElement;
}


export function initTimerMainPanel() {
    if (uiInjected) return;
  
    console.log('Panel: init timer main panel');
  
    const panel = createPanel();
    panel.style.display = 'block';
  
    uiInjected = true;
}