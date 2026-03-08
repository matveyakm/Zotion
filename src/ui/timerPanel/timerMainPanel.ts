import { uiCSS, timerMainPanelStyle } from '../CSS';
import { mainPanelHTML } from './timerPanelsHTML';
import { showTimerPanel, hideTimerPanel } from './timerPanel';

let panelElement: HTMLElement | null = null;
let uiInjected = false;

// Создаёт и внедряет в DOM (нижнюю) панель с кнопкой, открывающей настройки таймера
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
    panelElement.innerHTML = mainPanelHTML;
    panelElement.style.cssText = timerMainPanelStyle;
  
    document.body.appendChild(panelElement);
    
    const button = panelElement.querySelector('.zot-main-panel-button') as HTMLButtonElement;
    button.addEventListener('click', () => {
        if (button.classList.contains('zot-main-panel-button-active')) {
            button.classList.remove('zot-main-panel-button-active');
            hideTimerPanel();
        } else {
            button.classList.add('zot-main-panel-button-active');
            showTimerPanel();
        }
    });
  
    return panelElement;
}

// Меняет цвет кнопки для отображения статуса таймера
export function setTimerButtonState(state: 'study' | 'relax' | 'pause' | 'ellapsed' | 'normal') {
    const button = panelElement?.querySelector('.zot-main-panel-button') as HTMLElement;
    if (state === 'study') {
        button.style.color = '#5660DD';
    } else if (state === 'relax') {
        button.style.color = '#56DD60';
    } else if (state === 'pause') {
        button.style.color = '#F9D71C';
    } else if (state === 'ellapsed') {
        button.style.color = '#DD2222';
    } else {
        button.style.color = '#888';
    }
}

// Инициализирует (нижнюю) панель с кнопкой, открывающей настройки таймера
export function initTimerMainPanel() {
    if (uiInjected) return;
  
    console.log('Panel: init timer main panel');
  
    const panel = createPanel();
    panel.style.display = 'block';
  
    uiInjected = true;
}