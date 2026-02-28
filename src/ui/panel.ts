import { panelCSS, panelStyle } from './panelCSS';
import { panelHTML } from './panelHTML';

import { setupTopButtonListener } from './listeners/topButton';
import { setupSizeSelectionListener } from './listeners/sizeSelect';
import { setupColorPickerListener } from './listeners/colorPicker';
import { setupMoreButtonListener } from './listeners/moreButton';
import { setupApplyButtonListener } from './listeners/applyButton';

let panelElement: HTMLElement | null = null;
let uiInjected = false;

export interface TextAttributes {
  size: number | null;
  textColor: string | null;
  backgroundColor: string | null;
  decoration: number | null;
  decorationColor: string | null;
  fontStyle: number | null;
  fontWeight: number | null;
  letterSpacing: number | null;
  wordSpacing: number | null;
  lineHeight: number | null;
  textAlign: number | null;
  verticalAlign: number | null;
  href: string | null;
}

export let textAttributes: TextAttributes = {
  size: null,
  textColor: null,
  backgroundColor: null,
  decoration: null,
  decorationColor: null,
  fontStyle: null,
  fontWeight: null,
  letterSpacing: null,
  wordSpacing: null,
  lineHeight: null,
  textAlign: null,
  verticalAlign: null,
  href: null,
}

function createPanel() {
  if (panelElement) return panelElement;

  if (!document.getElementById('zot-slider-styles')) {
    const styleTag = document.createElement('style');
    styleTag.id = 'zot-slider-styles';
    styleTag.textContent = panelCSS;
    document.head.appendChild(styleTag);
  }

  panelElement = document.createElement('div');
  panelElement.id = 'zot-floating-panel';
  panelElement.innerHTML = panelHTML;
  panelElement.style.cssText = panelStyle;

  document.body.appendChild(panelElement);

  const example = panelElement.querySelector('#zot-font-example') as HTMLElement;
  
  // Логика нажатий на все zot-top-button
  setupTopButtonListener(panelElement, example);

  // Логика для селекта размера текста
  setupSizeSelectionListener(panelElement, example);

  // Логика для color picker
  setupColorPickerListener(panelElement, example);

  // Логика для кнопки "Дополнительно"
  setupMoreButtonListener(panelElement, example);
  
  // Листнер apply-btn
  setupApplyButtonListener(panelElement, example);

  return panelElement;
}



function showPanelNearSelection() {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    hidePanel();
    return;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  const panel = createPanel();
  panel.style.display = 'block';
}

function hidePanel() {
  if (panelElement) {
    //panelElement.style.display = 'none';
  }
}

function monitorSelection() {
  setInterval(() => {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      showPanelNearSelection();
    } else {
      hidePanel();
    }
  }, 300);

  document.addEventListener('click', (e) => {
    if (panelElement && !panelElement.contains(e.target as Node)) {
      hidePanel();
    }
  });
}

export function initBoldUI() {
  if (uiInjected) return;

  console.log('Panel: init floating panel');

  const observer = new MutationObserver(() => {
    if (document.querySelector('.notion-page-content')) {
      monitorSelection();
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  monitorSelection();

  uiInjected = true;
}