import { blockAttributes } from "../blockPanel";
import { hsvToRgb, rgbToHex } from '../../../utils/colorStyler';

const needToLog = false;

export const bpColorSettings = {
  currentTab: "Border" as "Border" | "Background",
  hue: 0,           // 0–360
  s: 0,             // 0–100
  v: 100,           // 0–100
  alpha: 1,         // 0–1
};

// Меняет видимость вкладок "Border" и "Background" в зависимости от типа блока (например, для у Divider не может быть background)
export function changeVisibilityOfTabs(panelElement: HTMLElement, hideBackgroundTab: boolean) {
  const bgTab    = panelElement.querySelector<HTMLElement>('.zot-tab[data-key="Background"]');
  const borderTab = panelElement.querySelector<HTMLElement>('.zot-tab[data-key="Border"]');

  if (!bgTab || !borderTab) return;

  if (hideBackgroundTab) {
    bgTab.classList.remove('zot-tab-active');
    bgTab.classList.add('zot-tab-hidden');
    borderTab.classList.add('zot-tab-active');
    bpColorSettings.currentTab = "Border";
  } else {
    bgTab.classList.remove('zot-tab-hidden');
  }
}

// Устанавливает все слушатели для элементов панели цветового пикера панели
export function setupBlockColorPickerListener(panelElement: HTMLElement) {
  const elements = {
    pickerBox:   panelElement.querySelector<HTMLElement>('#zot-bp-picker-box'),
    pickerCursor: panelElement.querySelector<HTMLElement>('#zot-bp-picker-cursor'),
    hueSlider:   panelElement.querySelector<HTMLElement>('#zot-bp-hue-slider'),
    hueMarker:   panelElement.querySelector<HTMLElement>('#zot-bp-hue-marker'),
    alphaSlider: panelElement.querySelector<HTMLInputElement>('#zot-bp-alpha-slider'),
    hexInput:    panelElement.querySelector<HTMLInputElement>('#zot-bp-hex-input'),
    applyBtn:    panelElement.querySelector<HTMLElement>('#zot-bp-apply-color-btn'),
    resetBtn:    panelElement.querySelector<HTMLElement>('#zot-bp-reset-color-btn'),
  };

  //  Вкладки (табы)
  const tabs = panelElement.querySelectorAll<HTMLElement>('.zot-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('zot-tab-active'));
      tab.classList.add('zot-tab-active');
      bpColorSettings.currentTab = (tab.getAttribute('data-key') as "Border" | "Background") || "Border";
      if (needToLog) console.log('Переключена вкладка:', bpColorSettings.currentTab);
    });
  });

  //  Hue-слайдер
  if (elements.hueSlider && elements.pickerBox && elements.hueMarker) {
    elements.hueSlider.addEventListener('mousedown', (e: MouseEvent) => {
      const moveHandler = (ev: MouseEvent) => {
        const rect = elements.hueSlider!.getBoundingClientRect();
        let y = ev.clientY - rect.top;
        y = Math.max(0, Math.min(y, rect.height));

        const percent = y / rect.height;
        if (elements.hueMarker) elements.hueMarker.style.top = `${percent * 100}%`;
        bpColorSettings.hue = Math.round(percent * 360);

        const baseRGB = hsvToRgb(bpColorSettings.hue, 1, 1);
        const baseHex = rgbToHex(baseRGB.r, baseRGB.g, baseRGB.b);
        elements.pickerBox!.style.setProperty('--current-hue-color', `#${baseHex}`);

        updateApplyButtonUI(elements);
      };

      moveHandler(e);
      window.addEventListener('mousemove', moveHandler);
      window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', moveHandler);
      }, { once: true });
    });
  }

  //  SV-площадь (Saturation + Value)
  if (elements.pickerBox && elements.pickerCursor) {
    elements.pickerBox.addEventListener('mousedown', (e: MouseEvent) => {
      const moveHandler = (ev: MouseEvent) => {
        const rect = elements.pickerBox!.getBoundingClientRect();

        let x = ev.clientX - rect.left;
        let y = ev.clientY - rect.top;
        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        bpColorSettings.s = Math.round((x / rect.width) * 100);
        bpColorSettings.v = Math.round(100 - (y / rect.height) * 100);

        elements.pickerCursor!.style.left = `${bpColorSettings.s}%`;
        elements.pickerCursor!.style.top  = `${100 - bpColorSettings.v}%`;

        updateApplyButtonUI(elements);
      };

      moveHandler(e);
      window.addEventListener('mousemove', moveHandler);
      window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', moveHandler);
      }, { once: true });
    });
  }

  //  Alpha-слайдер (мгновенное применение)
  if (elements.alphaSlider) {
    elements.alphaSlider.addEventListener('input', () => {
      bpColorSettings.alpha = Number(elements.alphaSlider!.value) / 100;
      const color = getRGBA(bpColorSettings.hue, bpColorSettings.s / 100, bpColorSettings.v / 100);
      applyColorToPreviews(panelElement, color);
      if (needToLog) console.log('Alpha изменён →', bpColorSettings.alpha);
    });
  }

  //  Кнопка Применить
  if (elements.applyBtn) {
    elements.applyBtn.addEventListener('click', () => {
      const color = getRGBA(bpColorSettings.hue, bpColorSettings.s / 100, bpColorSettings.v / 100);
      applyColorToPreviews(panelElement, color);
      if (needToLog) console.log('Цвет применён →', color, bpColorSettings);
    });
  }

  //  Кнопка Сброс
  if (elements.resetBtn) {
    elements.resetBtn.addEventListener('click', () => {
      const isBorder = bpColorSettings.currentTab === "Border";

      if (isBorder) {
        blockAttributes.borderColor = null;
        applyColorToPreviews(panelElement, { r: 128, g: 128, b: 128, a: 0.2 });
      } else {
        blockAttributes.backgroundColor = null;
        applyColorToPreviews(panelElement, { r: 0, g: 0, b: 0, a: 0 });
      }

      if (needToLog) console.log('Сброс цвета. Текущее состояние:', blockAttributes);
    });
  }

  //  Инициализация вида кнопки Apply
  if (elements.applyBtn) {
    updateApplyButtonUI(elements);
  }
}

// Преобразует текущие HSV-значения в RGBA, используя установленную прозрачность из настроек
function getRGBA(h: number, s: number, v: number) {
  const rgb = hsvToRgb(h, s, v);

  return {r: rgb.r, g: rgb.g, b: rgb.b, a: bpColorSettings.alpha};
}

// Форматирует RGBA в строку для CSS
function getRGBAString(r: number, g: number, b: number, a: number) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Форматирует RGBA в HEXA для хранения в атрибутах блока (последний символ - это прозрачность от 0 до 15)
function getHEXString(r: number, g: number, b: number, a: number) {
    const hex = rgbToHex(r, g, b);
    const alphaHex = Math.round(a * 15).toString(16);
    return `${hex}${alphaHex}`;
}

// Обновляет UI кнопки применения цвета в зависимости от текущего выбранного цвета (фон кнопки и цвет текста для контраста)
function updateApplyButtonUI(els: { applyBtn: HTMLElement | null; hexInput: HTMLInputElement | null }) {
  if (!els.applyBtn) return;

  const rgb = hsvToRgb(bpColorSettings.hue, bpColorSettings.s / 100, bpColorSettings.v / 100);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b).toUpperCase();
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  // placeholder в поле hex
  if (els.hexInput) {
    els.hexInput.placeholder = hex;
  }

  // цвет фона кнопки
  els.applyBtn.style.setProperty('--current-color', rgbStr);

  // контраст иконки внутри кнопки
  const isLight = bpColorSettings.v > 50;
  els.applyBtn.style.color = isLight ? '#000' : '#fff';
}

// Применяет выбранный цвет ко всем примерам в панели (текст, фон или граница в зависимости от текущей вкладки)
function applyColorToPreviews(panel: HTMLElement, rgba: {r: number, g: number, b: number, a: number}) {
  const previews = panel.querySelectorAll<HTMLElement>('.zot-bp-example');

  previews.forEach(preview => {
    const content = preview.querySelector<HTMLElement>('div, blockquote, [role="separator"]');
    if (!content) return;

    if (bpColorSettings.currentTab === "Border") {
      if (preview.id === 'zot-divider-example') {
        preview.querySelectorAll<HTMLElement>('[role="separator"]').forEach(line => {
          line.style.backgroundColor = getRGBAString(rgba.r, rgba.g, rgba.b, rgba.a);
        });
      } else {
        content.style.borderColor = getRGBAString(rgba.r, rgba.g, rgba.b, rgba.a);
      }
      blockAttributes.borderColor = getHEXString(rgba.r, rgba.g, rgba.b, rgba.a);
    } else {
      if (preview.id !== 'zot-divider-example') {
        content.style.backgroundColor = getRGBAString(rgba.r, rgba.g, rgba.b, rgba.a);
      }
      blockAttributes.backgroundColor = getHEXString(rgba.r, rgba.g, rgba.b, rgba.a);
    }
  });
}