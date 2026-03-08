import { uiCSS, leftPanelStyle } from '../CSS';
import { panelHTML } from './blockPanelHTML';

import { setupTypeSelectionListener } from './listeners/typeSelect';
import { setupTopButtonListener } from './listeners/topButton';
import { setupSelectListeners } from './listeners/selector';
import { setupBlockColorPickerListener } from './listeners/colorPicker';
import { setupApplyButtonListener } from './listeners/applyButton';

let panelElement: HTMLElement | null = null;
let uiInjected = false;

export interface BlockAttributes {
  type: number;
  radius: number | null;
  borderWidth: number | null;
  backgroundColor: string | null;
  borderColor: string | null;
  textAlign: number | null;
  verticalAlign: number | null;
}

export const blockAttributes: BlockAttributes = {
  type: 0,
  radius: null,
  borderWidth: null,
  backgroundColor: null,
  borderColor: null,
  textAlign: null,
  verticalAlign: null,
}

// Создание и внедрение в DOM панели для форматирования блоков
function createPanel() {
  if (panelElement) return panelElement;

  if (!document.getElementById('zot-block-panel')) {
    const styleTag = document.createElement('style');
    styleTag.id = 'zot-block-panel';
    styleTag.textContent = uiCSS;
    document.head.appendChild(styleTag);
  }

  panelElement = document.createElement('div');
  panelElement.id = 'zot-block-panel';
  panelElement.innerHTML = panelHTML;
  panelElement.style.cssText = leftPanelStyle;

  document.body.appendChild(panelElement);

  setupTypeSelectionListener(panelElement);

  setupTopButtonListener(panelElement);

  setupSelectListeners(panelElement);

  setupBlockColorPickerListener(panelElement);
  
  setupApplyButtonListener(panelElement);

  return panelElement;
}

// Показывает панель
export function showBlockPanel() {
  const panel = createPanel();
  panel.style.display = 'block';
}

// Скрывает панель
export function hideBlockPanel() {
  if (panelElement) {
    panelElement.style.display = 'none';
  }
}

// Инициализация панели
export function initBlockPanel() {
  if (uiInjected) return;

  console.log('Panel: init text panel');
  
  createPanel();

  uiInjected = true;
}