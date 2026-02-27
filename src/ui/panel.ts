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
  <div style="font-size: 1.3rem; font-weight: 600; margin-bottom: 8px; text-align: center; color: #fff;">
    Форматирование
  </div>


  <div style=
  "display: grid;
  grid-template-columns: repeat(4, 40px);
  gap: 8px;
  padding: 15px;
  padding-top: 0px;
  padding-bottom: 4px;
  border-radius: 8px;
  width: max-content;
  align-items: center;">
    <!-- Строка 1 -->
    <button style="font-weight: bold; height: 36px; background: none; border: none; color: #fff; cursor: pointer; font-size: 1.3rem;">B</button>
    <button style="font-style: italic; height: 36px; background: none; border: none; color: #fff; cursor: pointer; font-size: 1.3rem;">I</button>
    <div style="grid-column: 3 / span 3; padding: 4px 8px; background: linear-gradient(to right, #ffff00, #ffea00); color: #000; font-weight: bold; border-radius: 6px; font-size: 1.1rem; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
      Example
    </div>
  

  <!-- Строка 2 -->
    <button style="text-decoration: underline; height: 36px; background: none; border: none; color: #fff; cursor: pointer; font-size: 1.3rem;">U</button>
    <button style="text-decoration: overline; height: 36px; background: none; border: none; color: #fff; cursor: pointer; font-size: 1.3rem;">O</button>
    <button style="text-decoration: underline overline; height: 36px; background: none; border: none; color: #fff; cursor: pointer; font-size: 1.3rem;">T</button>
    <button style="text-decoration: line-through; height: 36px; background: none; border: none; color: #fff; cursor: pointer; font-size: 1.3rem;">S</button>
    <div style="height: 36px;"></div> 


  <!-- Строка 3 -->
  
    <button style="height: 36px; background: none; border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;">
      <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="6" y1="3" x2="18" y2="3" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <line x1="6" y1="8" x2="16" y2="8" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <line x1="6" y1="13" x2="18" y2="13" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <line x1="6" y1="18" x2="16" y2="18" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    </svg>
    </button>

    <button style="height: 36px; background: none; border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;">
      <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="5" y1="3" x2="19" y2="3" stroke="#fff" stroke-width="2"/>
        <line x1="7" y1="8" x2="17" y2="8" stroke="#fff" stroke-width="2"/>
        <line x1="5" y1="13" x2="19" y2="13" stroke="#fff" stroke-width="2"/>
        <line x1="7" y1="18" x2="17" y2="18" stroke="#fff" stroke-width="2"/>
      </svg>
    </button>

    <button style="height: 36px; background: none; border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;">
      <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="6" y1="3" x2="18" y2="3" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <line x1="8" y1="8" x2="18" y2="8" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <line x1="6" y1="13" x2="18" y2="13" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <line x1="8" y1="18" x2="18" y2="18" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    </svg>
    </button>

    <select style="height: 36px; padding: 0 8px; background: #2a2a2a; color: #fff; border: 1px solid #444; border-radius: 6px; font-size: 0.9rem; width: 60px;">
      <option>8</option>
      <option>9</option>
      <option>10</option>
      <option>11</option>
      <option>12</option>
      <option>13</option>
      <option>14</option>
      <option>15</option>
      <option>16</option>
      <option>17</option>
      <option>18</option>
      <option>20</option>
      <option>24</option>
      <option>28</option>
      <option>32</option>
      <option>40</option>
      <option>48</option>
    </select>
  </div>


  <!-- Вкладки -->
  <div style="display: flex; margin-bottom: 12px; justify-content: center; gap: 10px;">
    <button class="sv-tab active" style="background: none; border: none; color: #fff; font-size: 1rem; padding: 6px 12px; cursor: pointer; border-bottom: 2px solid #fff;">Текст</button>
    <button class="sv-tab" style="background: none; border: none; color: #888; font-size: 1rem; padding: 6px 12px; cursor: pointer;">Фон</button>
    <button class="sv-tab" style="background: none; border: none; color: #888; font-size: 1rem; padding: 6px 12px; cursor: pointer;">Линия</button>
  </div>


  <!-- Color picker -->
  <div style="position: relative; width: 80%; height: 120px; padding-right: 30px; background: linear-gradient(to right, #ffff00, #ff0000, #00ff00, #0000ff, #ff00ff, #ffff00); border-radius: 8px; overflow: hidden; margin-bottom: 8px;">
    <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, #000);"></div>
    <div style="position: absolute; width: 14px; height: 14px; background: #fff; border: 3px solid #000; border-radius: 50%; top: 45%; left: 55%; transform: translate(-50%, -50%); cursor: pointer;"></div>
  </div>

  <!-- Полоска справа -->
  <div style="position: absolute; right: 16px; top: 220px; width: 24px; height: 120px; background: linear-gradient(to bottom, #ff0000, #ff9900, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff); border-radius: 4px;"></div>


  <!-- Пресеты -->
  <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 8px;">
    <! -- ВОТ СЮДА СЛАЙДЕР -->
    <div style="width: 22px; height: 22px; background: #00bfff; border-radius: 50%; border: 2px solid #444; cursor: pointer;"></div>
    <div style="width: 22px; height: 22px; background: #90ee90; border-radius: 50%; border: 2px solid #444; cursor: pointer;"></div>
    <div style="width: 22px; height: 22px; background: #ffffff; border-radius: 50%; border: 2px solid #444; cursor: pointer;"></div>
    <!-- HEX -->
    <div style="text-align: center; font-size: 0.9rem; color: #aaa; margin-bottom: 8px;">ADAE47</div>
    </div>

  <!-- Ссылка -->
  <input type="text" placeholder="Ссылка..." style="width: 100%; padding: 8px; background: #2a2a2a; color: #fff; border: 1px solid #444; border-radius: 6px; font-size: 0.9rem; margin-bottom: 8px;">

  <!-- Дополнительно -->
  <div style="font-size: 0.9rem; color: #888; cursor: pointer;">▸ Дополнительно</div>

`;

  panelElement.style.cssText = `
    position: fixed !important;
    left: 20px !important;
    top: calc(50vh - 240px) !important;
    width: 250px !important;
    background: #191919 !important;
    color: #d9d9d9 !important;
    padding: 16px !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.8) !important;
    z-index: 2147483647 !important;
    font-family: system-ui, -apple-system, sans-serif !important;
    transform: scale(0.9) !important;
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