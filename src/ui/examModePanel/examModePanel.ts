import { toggleExamMode } from '../../modules/examMode/examMode';
import { uiCSS, examModePanelStyle } from '../CSS';

let panelElement: HTMLElement | null = null;
let uiInjected = false;

const panelHTML = `
    <button title="Режим экзамена" class="zot-main-panel-button" style="width:44px; height:44px; padding: 0">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" style="margin: 10px 8px;">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5.5 10.25l6.5 3.55 6.5-3.55L12 13.75 5.5 10.25z"/>
        <path d="M5 10v6c0 1.1 3.13 2 7 2s7-0.9 7-2v-6l-7 3.5L5 10z"/>
            </svg>
    </button>
`;

function createPanel() {
    if (panelElement) return panelElement;
  
    if (!document.getElementById('zot-exam-mode-panel')) {
      const styleTag = document.createElement('style');
      styleTag.id = 'zot-exam-mode-panel';
      styleTag.textContent = uiCSS;
      document.head.appendChild(styleTag);
    }
  
    panelElement = document.createElement('div');
    panelElement.id = 'zot-exam-mode-panel';
    panelElement.innerHTML = panelHTML;
    panelElement.style.cssText = examModePanelStyle;
  
    document.body.appendChild(panelElement);
    
    const button = panelElement.querySelector('.zot-main-panel-button') as HTMLButtonElement;
    button.addEventListener('click', () => {
        if (button.classList.contains('zot-main-panel-button-active')) {
            button.classList.remove('zot-main-panel-button-active');
        } else {
            button.classList.add('zot-main-panel-button-active');
        }
        toggleExamMode();
    });
  
    return panelElement;
}


export function initExamModePanel() {
    if (uiInjected) return;
  
    console.log('Panel: init exam mode panel');
  
    const panel = createPanel();
    panel.style.display = 'block';
  
    uiInjected = true;
}