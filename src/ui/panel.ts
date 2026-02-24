let panelElement: HTMLElement | null = null;
let uiInjected = false;

function createPanel() {
  if (panelElement) return panelElement;

  panelElement = document.createElement('div');
  panelElement.id = 'sv-floating-panel';
  panelElement.innerHTML = `
    <div style="font-size: 1.3rem; font-weight: 600; margin-bottom: 12px; text-align: center;">Форматирование</div>
    <button id="sv-bold-btn" style="font-size: 1.4rem; font-weight: bold; padding: 10px 20px; width: 100%; background: #2a2a2a; color: #fff; border: 1px solid #444; border-radius: 8px; cursor: pointer;">B Bold</button>
    <div style="margin-top: 12px; font-size: 0.8rem; opacity: 0.8; text-align: center;">Нажмите для toggle bold</div>
  `;

  panelElement.style.cssText = `
    position: absolute !important;
    width: 220px !important;
    background: #1e1e1e !important;
    color: #d9d9d9 !important;
    padding: 16px !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.6) !important;
    z-index: 2147483647 !important;
    font-family: system-ui, -apple-system, sans-serif !important;
    display: none;
    pointer-events: auto !important;
    border: 1px solid #333 !important;
  `;

  document.body.appendChild(panelElement);


  const boldBtn = panelElement.querySelector('#sv-bold-btn');
  boldBtn?.addEventListener('click', () => {
    toggleBoldOnSelection();
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

  let left = rect.left - 240;
  let top = rect.top + window.scrollY - 20;

  if (left < 10) left = 10;
  if (top < 10) top = 10;

  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
}

function hidePanel() {
  if (panelElement) {
    panelElement.style.display = 'none';
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

function toggleBoldOnSelection() {
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

  const existingA = range.startContainer.parentElement?.closest('a[href*="0.......1.....#"]');
  if (existingA) {
    console.log('Panel: Снимаем ссылку через unlink');
    document.execCommand('unlink', false);
    return;
  }

  const href = 'https://example.com/#0.......1.....#';

  console.log('Panel: Начинаю эмуляцию Ctrl+K для создания ссылки');

  editable.focus();

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const metaKey = isMac ? 'metaKey' : 'ctrlKey';

  // Эмулируем Ctrl+K / Cmd+K
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
        code: `Key${char.toUpperCase()}`,
      });
      urlInput.dispatchEvent(keyDown);

      urlInput.value += char;
      urlInput.dispatchEvent(new Event('input', { bubbles: true }));

      const keyUp = new KeyboardEvent('keyup', {
        bubbles: true,
        cancelable: true,
        key: char,
        code: `Key${char.toUpperCase()}`,
      });
      urlInput.dispatchEvent(keyUp);
    };

    // Вводим URL посимвольно 
    let i = 0;
    const interval = setInterval(() => {
      if (i < href.length) {
        typeChar(href[i]);
        i++;
      } else {
        clearInterval(interval);

        // Enter после ввода
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

        console.log('SimplyVisual: Ввод URL завершён, Enter отправлен');
      }
    }, 3); // 3 мс на символ — имитирует человеческий ввод
  }, 300);
}