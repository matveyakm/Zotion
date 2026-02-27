import { panelCSS, panelStyle } from './panelCSS';
import { panelHTML } from './panelHTML';

let panelElement: HTMLElement | null = null;
let uiInjected = false;

let textAttributes: {
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
} = {
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
}

function applyHrefToSelection(href: string) {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) {
    console.log('Panel: Нет выделенного текста');
    return;
  }

  const range = selection.getRangeAt(0);
  const editable = range.commonAncestorContainer.parentElement?.closest('[contenteditable="true"]') as HTMLElement | null;
  if (!editable) {
    console.log('Panel: Не найден contenteditable');
    return;
  }

  const existingA = range.startContainer.parentElement?.closest('a[href*="example.com"]');
  if (existingA) {
    console.log('Panel: Снимаем существующую ссылку');
    document.execCommand('unlink', false);
    return;
  }

  console.log('Panel: Начинаю эмуляцию Ctrl+K для создания ссылки с href:', href);

  editable.focus();

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const metaKey = isMac ? 'metaKey' : 'ctrlKey';

  const ctrlKDown = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key: 'k',
    code: 'KeyK',
    keyCode: 75,
    which: 75,
    [metaKey]: true,
  });
  editable.dispatchEvent(ctrlKDown);

  const ctrlKUp = new KeyboardEvent('keyup', {
    bubbles: true,
    cancelable: true,
    key: 'k',
    code: 'KeyK',
    keyCode: 75,
    which: 75,
    [metaKey]: true,
  });
  editable.dispatchEvent(ctrlKUp);

  setTimeout(() => {
    const urlInput = document.querySelector('input[placeholder*="Paste link or search pages"]') as HTMLInputElement | null;

    if (!urlInput) {
      console.warn('Panel: Input popup не найден');
      return;
    }

    console.log('Panel: Нашли input popup, начинаем посимвольный ввод URL');

    urlInput.focus();

    urlInput.value = '';

    const typeChar = (char: string) => {
      const keyDown = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: char,
        code: `Key${char.toUpperCase() || 'Digit' + char}`,
      });
      urlInput.dispatchEvent(keyDown);

      urlInput.value += char;
      urlInput.dispatchEvent(new Event('input', { bubbles: true }));

      const keyUp = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        key: char,
        code: `Key${char.toUpperCase() || 'Digit' + char}`,
      });
      urlInput.dispatchEvent(keyUp);
    };

    let i = 0;
    const interval = setInterval(() => {
      if (i < href.length) {
        typeChar(href[i]);
        i++;
      } else {
        clearInterval(interval);

        const enterDown = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
        });
        urlInput.dispatchEvent(enterDown);

        const enterUp = new KeyboardEvent('keyup', {
          bubbles: true,
          cancelable: true,
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
        });
        urlInput.dispatchEvent(enterUp);

        console.log('Panel: Ввод URL завершён, Enter отправлен');
      }
    }, 15);
  }, 400);
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

  panelElement.querySelectorAll('button[data-key]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('zot-tab-active');
      (btn as HTMLButtonElement).style.background = btn.classList.contains('zot-tab-active') ? '#555' : '#333';
    });
  });

  const toggleBtn = panelElement.querySelector('#zot-advanced-toggle');
  const content = panelElement.querySelector('#zot-advanced-content') as HTMLElement;

  if (toggleBtn && content) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = content.style.display === 'none';
      
      content.style.display = isHidden ? 'flex' : 'none';
      toggleBtn.textContent = isHidden ? '▾ Дополнительно' : '▸ Дополнительно';
    });
  }

  const applyBtn = panelElement.querySelector('#zot-apply-btn');
  applyBtn?.addEventListener('click', () => {
    let attrs = '0'; 
    const size = (panelElement.querySelector('#zot-size') as HTMLSelectElement).value;
    attrs += `.${size || ''}`;

    const textColor = (panelElement.querySelector('#zot-text-color') as HTMLInputElement).value.replace('#', '').toUpperCase();
    attrs += `.${textColor || ''}`;

    const bgColor = (panelElement.querySelector('#zot-bg-color') as HTMLInputElement).value.replace('#', '').toUpperCase();
    attrs += `.${bgColor || ''}`;

    const line = (panelElement.querySelector('#zot-line') as HTMLSelectElement).value;
    attrs += `.${line || ''}`;

    const bold = panelElement.querySelector('[data-key="bold"]')?.classList.contains('zot-tab-active') ? '1' : '';
    attrs += '.......' + bold + '.....#';

    const fullHref = 'https://example.com/#' + attrs;

    console.log('Panel: Применяю атрибуты:', attrs);

    applyHrefToSelection(fullHref);

    hidePanel();
  });

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