let panelElement: HTMLElement | null = null;
let uiInjected = false;

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

  panelElement = document.createElement('div');
  panelElement.id = 'sv-floating-panel';
  panelElement.innerHTML = `
    <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 14px; text-align: center;">Форматирование</div>

    <div style="display: flex; gap: 6px; margin-bottom: 14px; justify-content: center; flex-wrap: wrap;">
      <button data-key="bold" data-pos="7" data-value="1" style="font-weight: bold; width: 36px; height: 36px; background: #333; border: 1px solid #555; border-radius: 6px; color: #fff; cursor: pointer;">B</button>
      <button data-key="italic" data-pos="6" data-value="1" style="font-style: italic; width: 36px; height: 36px; background: #333; border: 1px solid #555; border-radius: 6px; color: #fff; cursor: pointer;">I</button>
      <button data-key="underline" data-pos="4" data-value="1" style="text-decoration: underline; width: 36px; height: 36px; background: #333; border: 1px solid #555; border-radius: 6px; color: #fff; cursor: pointer;">U</button>
      <button data-key="strikethrough" data-pos="4" data-value="3" style="text-decoration: line-through; width: 36px; height: 36px; background: #333; border: 1px solid #555; border-radius: 6px; color: #fff; cursor: pointer;">S</button>
      <button data-key="code" data-pos="4" data-value="5" style="font-family: monospace; width: 36px; height: 36px; background: #333; border: 1px solid #555; border-radius: 6px; color: #fff; cursor: pointer;">T</button>
    </div>

    <div style="margin-bottom: 14px;">
      <label style="display: block; margin-bottom: 5px; font-size: 0.85rem;">Размер</label>
      <select id="sv-size" style="width: 100%; padding: 7px; background: #2a2a2a; color: #fff; border: 1px solid #444; border-radius: 6px; font-size: 0.9rem;">
        <option value="">По умолчанию</option>
        <option value="0">Tiny (очень маленький)</option>
        <option value="1">Extra Small</option>
        <option value="2">Small</option>
        <option value="3">Smaller</option>
        <option value="4">Normal small</option>
        <option value="5">Normal</option>
        <option value="6">Normal large</option>
        <option value="7">Large</option>
        <option value="8">Extra Large</option>
        <option value="9">Huge</option>
        <option value="A">Extra Huge</option>
        <option value="B">Very Huge</option>
        <option value="C">Massive</option>
        <option value="D">Enormous</option>
        <option value="E">Gigantic</option>
        <option value="F">Colossal</option>
      </select>
    </div>

    <div style="margin-bottom: 14px;">
      <label style="display: block; margin-bottom: 5px; font-size: 0.85rem;">Цвет текста</label>
      <input type="color" id="sv-text-color" value="#ffffff" style="width: 100%; height: 36px; border: none; border-radius: 6px; cursor: pointer;">
    </div>

    <div style="margin-bottom: 14px;">
      <label style="display: block; margin-bottom: 5px; font-size: 0.85rem;">Цвет фона</label>
      <input type="color" id="sv-bg-color" value="#000000" style="width: 100%; height: 36px; border: none; border-radius: 6px; cursor: pointer;">
    </div>

    <div style="margin-bottom: 14px;">
      <label style="display: block; margin-bottom: 5px; font-size: 0.85rem;">Линия</label>
      <select id="sv-line" style="width: 100%; padding: 7px; background: #2a2a2a; color: #fff; border: 1px solid #444; border-radius: 6px; font-size: 0.9rem;">
        <option value="">Нет</option>
        <option value="1">Подчёркивание</option>
        <option value="2">Надчёркивание</option>
        <option value="3">Зачёркивание</option>
      </select>
    </div>

    <button id="sv-apply-btn" style="font-size: 1rem; padding: 10px; width: 100%; background: #4a90e2; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 12px;">
      Применить
    </button>

    <div style="margin-top: 10px; font-size: 0.75rem; opacity: 0.8; text-align: center;">
      Применит стили к выделенному тексту
    </div>
  `;

  panelElement.style.cssText = `
    position: fixed !important;
    left: 20px !important;
    top: calc(50vh - 200px) !important;
    width: 280px !important;
    background: #1e1e1e !important;
    color: #d9d9d9 !important;
    padding: 20px !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.7) !important;
    z-index: 2147483647 !important;
    font-family: system-ui, -apple-system, sans-serif !important;
    transform: scale(0.85) !important;
    transform-origin: top left !important;
    display: none;
    pointer-events: auto !important;
    border: 1px solid #333 !important;
  `;

  document.body.appendChild(panelElement);

  panelElement.querySelectorAll('button[data-key]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      btn.style.background = btn.classList.contains('active') ? '#555' : '#333';
    });
  });

  const applyBtn = panelElement.querySelector('#sv-apply-btn');
  applyBtn?.addEventListener('click', () => {
    let attrs = '0'; // type = 0

    const size = (panelElement.querySelector('#sv-size') as HTMLSelectElement).value;
    attrs += `.${size || ''}`;

    const textColor = (panelElement.querySelector('#sv-text-color') as HTMLInputElement).value.replace('#', '').toUpperCase();
    attrs += `.${textColor || ''}`;

    const bgColor = (panelElement.querySelector('#sv-bg-color') as HTMLInputElement).value.replace('#', '').toUpperCase();
    attrs += `.${bgColor || ''}`;

    const line = (panelElement.querySelector('#sv-line') as HTMLSelectElement).value;
    attrs += `.${line || ''}`;

    const bold = panelElement.querySelector('[data-key="bold"]')?.classList.contains('active') ? '1' : '';
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