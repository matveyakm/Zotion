import { BlockAttributes } from "../blockPanel";
import { hsvToRgb, rgbToHex } from '../../../utils/colorStyler';

// Локальное состояние для конкретной панели блоков
const bpState = {
  hue: 0,
  s: 0,
  v: 100,
  alpha: 1,
  currentTab: "Border" as "Border" | "Background"
};

export function changeVisibilityOfTabs(panelElement: HTMLElement, hideBackgroundTab: boolean) {
  const backgroundTab = panelElement.querySelector('.zot-tab[data-key="Background"]') as HTMLElement;
  const borderTab = panelElement.querySelector('.zot-tab[data-key="Border"]') as HTMLElement;
  if (hideBackgroundTab) {
    backgroundTab.classList.remove('zot-tab-active');
    backgroundTab.classList.add('zot-tab-hidden');
    borderTab.classList.add('zot-tab-active');
    bpState.currentTab = "Border";
  } else {
    backgroundTab.classList.remove('zot-tab-hidden');
  }

}

export function setupBlockColorPickerListener(panelElement: HTMLElement) {
  const pickerBox = panelElement.querySelector('#zot-bp-picker-box') as HTMLElement;
  const pickerCursor = panelElement.querySelector('#zot-bp-picker-cursor') as HTMLElement;
  const hueSlider = panelElement.querySelector('#zot-bp-hue-slider') as HTMLElement;
  const hueMarker = panelElement.querySelector('#zot-bp-hue-marker') as HTMLElement;
  const alphaSlider = panelElement.querySelector('#zot-bp-alpha-slider') as HTMLInputElement;
  const hexInput = panelElement.querySelector('#zot-bp-hex-input') as HTMLInputElement;
  const applyBtn = panelElement.querySelector('#zot-bp-apply-color-btn') as HTMLElement;

  // 1. Вспомогательная функция для обновления визуального состояния кнопки индикатора
  const updateApplyButtonUI = () => {
    const rgb = hsvToRgb(bpState.hue, bpState.s / 100, bpState.v / 100);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    
    // Обновляем плейсхолдер инпута
    if (hexInput) hexInput.placeholder = hex.toUpperCase();
    
    // Красим кнопку "Применить" (стрелочку), чтобы пользователь видел, какой цвет выбрал
    applyBtn.style.setProperty('--current-color', rgbString);
    
    // Инвертируем цвет стрелочки для контраста (черная на светлом, белая на темном)
    const contrastV = bpState.v > 50 ? 0 : 1;
    const cRgb = hsvToRgb(0, 0, contrastV);
    applyBtn.style.color = `rgb(${cRgb.r}, ${cRgb.g}, ${cRgb.b})`;
  };

  // 2. Функция для формирования финальной строки цвета (с учетом текущей Альфы)
  const getFinalColor = () => {
    const rgb = hsvToRgb(bpState.hue, bpState.s / 100, bpState.v / 100);
    return bpState.alpha === 1 
      ? `#${rgbToHex(rgb.r, rgb.g, rgb.b)}` 
      : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bpState.alpha})`;
  };

  // 3. Мгновенное применение (используется только для Alpha и кнопки Apply)
  const applyToPreviewAndState = (color: string) => {
    const previews = panelElement.querySelectorAll('.zot-bp-example');
    previews.forEach(preview => {
      const content = preview.querySelector('div, blockquote, [role="separator"]') as HTMLElement;
      if (!content) return;

      if (bpState.currentTab === "Border") {
        if (preview.id === 'zot-divider-example') {
          const lines = preview.querySelectorAll('[role="separator"]');
          lines.forEach(l => (l as HTMLElement).style.backgroundColor = color);
        } else {
          content.style.borderColor = color;
        }
        BlockAttributes.borderColor = color;
      } else {
        if (preview.id !== 'zot-divider-example') {
            content.style.backgroundColor = color;
        }

        BlockAttributes.backgroundColor = color;
      }
    });
  };

  // --- ЛИСТЕНЕРЫ ---

  // Табы
  panelElement.querySelectorAll('.zot-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      panelElement.querySelectorAll('.zot-tab').forEach(t => t.classList.remove('zot-tab-active'));
      tab.classList.add('zot-tab-active');
      bpState.currentTab = (tab.getAttribute('data-key') as "Border" | "Background") || "Border";
    });
  });

  // SV-Пикер (только UI кнопки)
  pickerBox?.addEventListener('mousedown', (e) => {
    const move = (me: MouseEvent) => {
      const rect = pickerBox.getBoundingClientRect();
      bpState.s = Math.max(0, Math.min(100, ((me.clientX - rect.left) / rect.width) * 100));
      bpState.v = Math.max(0, Math.min(100, 100 - ((me.clientY - rect.top) / rect.height) * 100));
      
      pickerCursor.style.left = `${bpState.s}%`;
      pickerCursor.style.top = `${100 - bpState.v}%`;
      updateApplyButtonUI(); // Превью в блоках НЕ вызываем
    };
    move(e);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', () => window.removeEventListener('mousemove', move), { once: true });
  });

  // Hue-Пикер (только UI кнопки + цвет фона квадрата)
  hueSlider?.addEventListener('mousedown', (e) => {
    const move = (me: MouseEvent) => {
      const rect = hueSlider.getBoundingClientRect();
      const y = Math.max(0, Math.min(1, (me.clientY - rect.top) / rect.height));
      bpState.hue = y * 360;
      hueMarker.style.top = `${y * 100}%`;
      
      const baseRGB = hsvToRgb(bpState.hue, 1, 1);
      pickerBox.style.setProperty('--current-hue-color', `#${rgbToHex(baseRGB.r, baseRGB.g, baseRGB.b)}`);
      updateApplyButtonUI(); // Превью в блоках НЕ вызываем
    };
    move(e);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', () => window.removeEventListener('mousemove', move), { once: true });
  });

  // Alpha-слайдер (МГНОВЕННОЕ применение к превью и в стейт)
  alphaSlider?.addEventListener('input', () => {
    bpState.alpha = parseInt(alphaSlider.value) / 100;
    applyToPreviewAndState(getFinalColor());
  });

  // Кнопка Применить (Фиксация выбранного цвета)
  applyBtn?.addEventListener('click', () => {
    applyToPreviewAndState(getFinalColor());
  });

  // Кнопка Сброса
  panelElement.querySelector('#zot-bp-reset-color-btn')?.addEventListener('click', () => {
    const isBorder = bpState.currentTab === "Border";
    if (isBorder) BlockAttributes.borderColor = null;
    else BlockAttributes.backgroundColor = null;
    applyToPreviewAndState(isBorder ? 'rgba(128, 128, 128, 0.2)' : 'transparent');
  });
}