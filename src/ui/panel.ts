import { panelCSS, panelStyle } from './panelCSS';
import { panelHTML } from './panelHTML';
import { hsvToRgb, rgbToHex } from '../utils/colorStyler';

const hrefLinkPrefix = "https://example.com/#";

let panelElement: HTMLElement | null = null;
let uiInjected = false;

let currentHue = 0;
let currentTab = "Text"
let currentOpacity = 1;
let coordiatesOfSVPicker = { x: 0, y: 0 };
let rectOfSVPicker = { width: 0, height: 0 };

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
  href: string | null;
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
  href: null,
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
    }, 3);
  }, 200);
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
  panelElement.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('.zot-top-button');
    if (!btn) return;
  
    e.stopPropagation();
  
    const group = btn.closest('.zot-decoration-btn, .zot-alignment-button') 
      ? btn.classList.contains('zot-decoration-btn') ? 'decoration' : 'alignment'
      : null;
  
    // Если кнопка в группе (decoration или alignment)
    if (group) {
      const groupButtons = panelElement.querySelectorAll(
        group === 'decoration' ? '.zot-decoration-btn' : '.zot-alignment-button'
      );
  
      // Если уже активна — снимаем
      if (btn.classList.contains('zot-top-button-active')) {
        btn.classList.remove('zot-top-button-active');
      } else {
        groupButtons.forEach(b => b.classList.remove('zot-top-button-active'));
        btn.classList.add('zot-top-button-active');
      }
  
      console.log(`${group} group updated:`, Array.from(groupButtons).map(b => ({
        id: b.id,
        active: b.classList.contains('zot-top-button-active')
      })));
    } else {
      // Обычная кнопка (не в группе) — просто toggle
      btn.classList.toggle('zot-top-button-active');
      console.log('Обычная кнопка toggled:', btn.id, btn.classList.contains('zot-top-button-active'));
    }
  
    // Обновление textAttributes (для всех кнопок с data-key)
    const key = btn.getAttribute('data-key');
    const value = btn.getAttribute('data-value');
    const isActive = btn.classList.contains('zot-top-button-active');
    
    if (key) {
      if (key == 'fontWeight') {
        example.style.fontWeight = isActive ? "bold" : 'normal';
        console.log('Updated example fontWeight');
      } else if (key === 'fontStyle') {
        example.style.fontStyle = isActive ? "italic" : 'normal';
      } else if (key === 'decoration') {
        const decorationValue = parseInt(value || '0', 10);
        if (isActive && !isNaN(decorationValue) && decorationValue > 0 && decorationValue <= 4) {
          if (decorationValue === 1) {
            example.style.textDecoration = 'underline';
          } else if (decorationValue === 2) {
            example.style.textDecoration = 'overline';
          } else if (decorationValue === 3) {
            example.style.textDecoration = 'line-through';
          } else if (decorationValue === 4) {
            example.style.textDecoration = 'underline overline';
          }
        } else {
          example.style.textDecoration = 'none';
        }
      } else if (key === 'textAlign') {
        const alignmentValue = parseInt(value || '0', 10);
        if (isActive && !isNaN(alignmentValue) && alignmentValue >= 0 && alignmentValue <= 2) {
          if (alignmentValue === 0) {
            example.style.textAlign = 'left';
          } else if (alignmentValue === 1) {
            example.style.textAlign = 'center';
          } else if (alignmentValue === 2) {
            example.style.textAlign = 'right';
          }
        } else {
          example.style.textAlign = 'center';
        }
        console.log('Updated example textAlign', example.style.textAlign);
      }

      textAttributes[key as keyof typeof textAttributes] = isActive ? value : null;
      console.log('Обновлено textAttributes:', textAttributes);
    }
  });

  //Листнер для селекта размера текста
  const sizeSelect = panelElement.querySelector('#zot-font-size-select') as HTMLSelectElement | null;
  if (sizeSelect) {
    sizeSelect.addEventListener('change', () => {
      const selectedValue = sizeSelect.value || null;
      textAttributes.size = parseInt(selectedValue || "16", 10);

      if (!isNaN(textAttributes.size)) {
        if (textAttributes.size <= 20) {
          example.style.fontSize = `${textAttributes.size}px`;
        } else {
          example.style.fontSize = '20px';
        }
      }
      console.log('Обновлено textAttributes.size:', textAttributes.size);
      console.log('Текущее состояние textAttributes:', textAttributes);
    });
  }

  // Логика для вкладок
  const tabs = panelElement.querySelectorAll('.zot-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('zot-tab-active'));
      tab.classList.add('zot-tab-active');
      currentTab = tab.getAttribute('data-key') || "Text";
      console.log('Переключена вкладка:', tab.textContent);
    });
  });

  // Листенер для цветового hue-пикера
  const hueSlider = panelElement.querySelector('#zot-hue-slider') as HTMLElement;
  const hueMarker = panelElement.querySelector('#zot-hue-marker') as HTMLElement;
  const pickerBox = panelElement.querySelector('#zot-picker-box') as HTMLElement;
  if (hueSlider && pickerBox) {
    hueSlider.addEventListener('click', (e: MouseEvent) => {
      const rect = hueSlider.getBoundingClientRect();
      
      // Находим позицию клика по вертикали (от 0 до 1)
      let y = e.clientY - rect.top;
      y = Math.max(0, Math.min(y, rect.height)); // Ограничиваем 
      
      const percentY = y / rect.height;

      // Вычисляем Hue (0-360 градусов)
      // В градиенте сверху вниз: 0 = красный, 360 = фиолетовый/снова красный
      hueMarker.style.top = `${percentY * 100}%`;
      currentHue = Math.round(percentY * 360);

      // Обновляем фон основного квадрата (Saturation/Value box)
      // Мы берем чистый цвет (S=1, V=1) для этого оттенка
      const baseRGB = hsvToRgb(currentHue, 1, 1);
      const baseHex = rgbToHex(baseRGB.r, baseRGB.g, baseRGB.b);
      
      pickerBox.style.setProperty('--current-hue-color', "#"+baseHex);
      toggleColor(); 
    });
  }

  // Листенер для цветового SV-пикера
  const pickerCursor = panelElement.querySelector('#zot-picker-cursor') as HTMLElement;
  if (pickerBox) {
    pickerBox.addEventListener('click', (e: MouseEvent) => {
      const rect = pickerBox.getBoundingClientRect();
      
      coordiatesOfSVPicker.x = e.clientX - rect.left;
      coordiatesOfSVPicker.y = e.clientY - rect.top;
      rectOfSVPicker.width = rect.width;
      rectOfSVPicker.height = rect.height;

      coordiatesOfSVPicker.x = Math.max(0, Math.min(coordiatesOfSVPicker.x, rectOfSVPicker.width));
      coordiatesOfSVPicker.y = Math.max(0, Math.min(coordiatesOfSVPicker.y, rectOfSVPicker.height));

      // Визуально двигаем курсор
      const sPercent = (coordiatesOfSVPicker.x / rectOfSVPicker.width) * 100;
      const vPercent = (coordiatesOfSVPicker.y / rectOfSVPicker.height) * 100;
      
      pickerCursor.style.left = `${sPercent}%`;
      pickerCursor.style.top = `${vPercent}%`;
      toggleColor();
    });
  }

  // Листенер для кнопки сброса цвета
  const resetBtn = panelElement.querySelector('#zot-reset-color-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (currentTab === "Text") {
        example.style.color = '#fff';
        textAttributes.textColor = null;
      } else if (currentTab === "Background") {
        example.style.backgroundColor = '';
        textAttributes.backgroundColor = null;
      } else if (currentTab === "Decoration") {
        example.style.textDecorationColor = '';
        textAttributes.decorationColor = null;
      }

      console.log('Сброс цвета. Текущее состояние textAttributes:', textAttributes);
    });
  }

  // Листенер для кнопки применения цвета
  const applyColorBtn = panelElement.querySelector('#zot-apply-color-btn');
  if (applyColorBtn) {
    applyColorBtn.addEventListener('click', () => {
      toggleColor(true);
      console.log('Цвет применён. Текущее состояние textAttributes:', textAttributes);
    });
  }

  // Листенер для ползунка прозрачности (TO DO)
  // const opacitySlider = panelElement.querySelector('#zot-opacity-slider') as HTMLInputElement;
  // if (opacitySlider) {
  //   opacitySlider.addEventListener('input', () => {
  //     const val = parseInt(opacitySlider.value);
  //     currentOpacity = val / 16;
      
  //     //example.style.opacity = (Math.min(opacityLevel + 0.1, 1)).toString();
      
  //     console.log(`Opacity set to: ${Math.round(currentOpacity * 100)}%`);
  //   });
  // }

  // Дополнительно: логика для advanced-toggle (уже есть в твоём коде)
  const toggleBtn = panelElement.querySelector('#zot-advanced-toggle');
  const content = panelElement.querySelector('#zot-advanced-content') as HTMLElement;

  if (toggleBtn && content) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = content.style.display === 'none' || content.style.display === '';
      
      content.style.display = isHidden ? 'flex' : 'none';
      toggleBtn.textContent = isHidden ? '▾ Дополнительно' : '▸ Дополнительно';
    });
  }

  // Листнер apply-btn
  const applyBtn = panelElement.querySelector('#zot-apply-btn'); 
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      applyHrefToSelection(generateHref());
    });
  }

  return panelElement;
}

function toggleColor(needToApply : boolean = false) {
  const example = panelElement.querySelector('#zot-font-example') as HTMLElement;
  const hexInput = panelElement.querySelector('#zot-hex-input') as HTMLElement;
  const applyColorBtn = panelElement.querySelector('#zot-apply-color-btn') as HTMLElement;

  let x = coordiatesOfSVPicker.x;
  let y = coordiatesOfSVPicker.y;
  let width = rectOfSVPicker.width;
  let height = rectOfSVPicker.height;

  // Цвета (S и V в диапазоне 0...1)
  const saturation = x / width;
  const value = 1 - (y / height); // Инвертируем Y: верх = 1, низ = 0

  // Получаем итоговый rgb
  const selectedRgb = hsvToRgb(currentHue, saturation, value);
  const selectedRgbString = `rgb(${selectedRgb.r}, ${selectedRgb.g}, ${selectedRgb.b})`;
  const seletedHexString = `${rgbToHex(selectedRgb.r, selectedRgb.g, selectedRgb.b)}`;

  const selectedRgbaString = `rgba(${selectedRgb.r}, ${selectedRgb.g}, ${selectedRgb.b}, ${9.0/16.0})`;

  if (needToApply) {
    if (currentTab === "Text") {
      example.style.color = selectedRgbString;
      textAttributes.textColor = seletedHexString;
      console.log('Текущее состояние textAttributes:', textAttributes);
    } else if (currentTab === "Background") {
      example.style.backgroundColor = selectedRgbaString;
      textAttributes.backgroundColor = seletedHexString;
      console.log('Текущее состояние textAttributes:', textAttributes);
    } else if (currentTab === "Decoration") {
      example.style.textDecorationColor = selectedRgbString;
      textAttributes.decorationColor = seletedHexString;
    } else {
      console.warn('Неизвестная вкладка для выбора цвета:', currentTab);
    }
  }

  hexInput.setAttribute('placeholder', seletedHexString.toUpperCase());
  applyColorBtn.style.setProperty('--current-color', selectedRgbString);
  applyColorBtn.style.color = `rgb(${255-selectedRgb.r}, ${255-selectedRgb.g}, ${255-selectedRgb.b})`

}

function generateHref() : string {
  const objectType = 0; // text
  let href = hrefLinkPrefix + [ 
    objectType, // 0
    textAttributes.size ? `${textAttributes.size}` : '', // 1
    textAttributes.textColor ? `${textAttributes.textColor}` : '', // 2
    textAttributes.backgroundColor ? `${textAttributes.backgroundColor}` : '', // 3
    textAttributes.decoration ? `${textAttributes.decoration}` : '', // 4
    textAttributes.decorationColor ? `${textAttributes.decorationColor}` : '', // 5
    textAttributes.fontStyle ? `${textAttributes.fontStyle}` : '', // 6
    textAttributes.fontWeight ? `${textAttributes.fontWeight}` : '', // 7
    textAttributes.letterSpacing ? `${textAttributes.letterSpacing}` : '', // 8
    textAttributes.wordSpacing ? `${textAttributes.wordSpacing}` : '', // 9
    textAttributes.lineHeight ? `${textAttributes.lineHeight}` : '', // 10
    textAttributes.textAlign ? `${textAttributes.textAlign}` : '', // 11
    textAttributes.verticalAlign ? `${textAttributes.verticalAlign}` : '', // 12
  ].join('.') + "#";
  console.log('Generated href:', href);
  return href;
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