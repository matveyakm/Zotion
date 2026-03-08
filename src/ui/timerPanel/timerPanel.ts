import { uiCSS, leftPanelStyle } from '../CSS';
import { panelHTML } from './timerPanelsHTML';

import { setupInputListeners } from './listeners/inputListener';
import { setupButtonListeners } from './listeners/buttonListeners';
import { setupStatsListener } from './listeners/statsListener';

import { setLazyTimer, setStrictTimer } from './timerUtils';

let panelElement: HTMLElement | null = null;
let uiInjected = false;

export let uiShown = false;

// Создаёт и внедряет в DOM панель с настройкой таймера
function createPanel() {
  if (panelElement) return panelElement;

  if (!document.getElementById('zot-timer-panel')) {
    const styleTag = document.createElement('style');
    styleTag.id = 'zot-timer-panel';
    styleTag.textContent = uiCSS;
    document.head.appendChild(styleTag);
  }

  panelElement = document.createElement('div');
  panelElement.id = 'zot-timer-panel';
  panelElement.innerHTML = panelHTML;
  panelElement.style.cssText = leftPanelStyle;
  panelElement.style.top = '';
  panelElement.style.bottom = '100px';

  document.body.appendChild(panelElement);

  setupInputListeners(panelElement);

  setupButtonListeners(panelElement);

  setupStatsListener(panelElement);

  return panelElement;
}

// Показывает панель, меняет 'тикер' на точный, для качественного и оперативного показа времени
export function showTimerPanel() {
  const panel = createPanel();
  panel.style.display = 'block';
  uiShown = true;

  setStrictTimer(panel);
}

// Скрывает панель, меняет 'тикер' на ленивый, он менее точный, но сильно оптимизированнее
export function hideTimerPanel() {
  uiShown = false;
  if (panelElement) {
    panelElement.style.display = 'none';
    setLazyTimer(panelElement);
  }
}

// Инициализирует панель
// Сразу запускает ленивый тикер
export function initTimerPanel() {
  if (uiInjected) return;

  console.log('Panel: init timer panel');
  
  const panel = createPanel();

  setLazyTimer(panel);

  uiInjected = true;
}