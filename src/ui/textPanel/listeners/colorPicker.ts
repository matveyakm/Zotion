import { textAttributes } from "../textPanel";
import { hsvToRgb, rgbToHex } from '../../../utils/colorStyler';
import { colorPickerSettings,toggleColor } from '../../utils/colorPickerUtils';

const needToLog = false;

// Общая функция для установки всех листенеров, связанных с цветовым пикером (вкладки, hue-слайдер, SV-пикер, кнопки сброса и применения цвета)
export function setupColorPickerListener(panelElement: HTMLElement, example: HTMLElement) {
  // -=-=-=-=-=-=-=-=-=- Вкладки -=-=-=-=-=-=-=-=-=- //
  const tabs = panelElement.querySelectorAll('.zot-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('zot-tab-active'));
      tab.classList.add('zot-tab-active');
      colorPickerSettings.currentTab = tab.getAttribute('data-key') || "Text";
      if (needToLog) console.log('Переключена вкладка:', tab.textContent);
    });
  });

  // -=-=-=-=-=-=-=-=-=- Hue-пикер -=-=-=-=-=-=-=-=-=- //
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
      colorPickerSettings.currentHue = Math.round(percentY * 360);

      // Обновляем фон основного квадрата (Saturation/Value box)
      // Мы берем чистый цвет (S=1, V=1) для этого оттенка
      const baseRGB = hsvToRgb(colorPickerSettings.currentHue, 1, 1);
      const baseHex = rgbToHex(baseRGB.r, baseRGB.g, baseRGB.b);
      
      pickerBox.style.setProperty('--current-hue-color', "#"+baseHex);
      toggleColor(panelElement, textAttributes); 
    });
  }

  // -=-=-=-=-=-=-=-=-=- SV-пикер -=-=-=-=-=-=-=-=-=- //
  const pickerCursor = panelElement.querySelector('#zot-picker-cursor') as HTMLElement;
  if (pickerBox) {
    pickerBox.addEventListener('click', (e: MouseEvent) => {
      const rect = pickerBox.getBoundingClientRect();
      
      colorPickerSettings.SVPicker.x = e.clientX - rect.left;
      colorPickerSettings.SVPicker.y = e.clientY - rect.top;
      colorPickerSettings.SVPicker.width = rect.width;
      colorPickerSettings.SVPicker.height = rect.height;

      colorPickerSettings.SVPicker.x = Math.max(0, Math.min(colorPickerSettings.SVPicker.x, colorPickerSettings.SVPicker.width));
      colorPickerSettings.SVPicker.y = Math.max(0, Math.min(colorPickerSettings.SVPicker.y, colorPickerSettings.SVPicker.height));

      // Визуально двигаем курсор
      const sPercent = (colorPickerSettings.SVPicker.x / colorPickerSettings.SVPicker.width) * 100;
      const vPercent = (colorPickerSettings.SVPicker.y / colorPickerSettings.SVPicker.height) * 100;
      
      pickerCursor.style.left = `${sPercent}%`;
      pickerCursor.style.top = `${vPercent}%`;
      toggleColor(panelElement,textAttributes);
    });
  }

  // -=-=-=-=-=-=-=-=-=- Кнопка сброса -=-=-=-=-=-=-=-=-=- //
  const resetBtn = panelElement.querySelector('#zot-reset-color-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (colorPickerSettings.currentTab === "Text") {
        example.style.color = '#fff';
        textAttributes.textColor = null;
      } else if (colorPickerSettings.currentTab === "Background") {
        example.style.backgroundColor = '';
        textAttributes.backgroundColor = null;
      } else if (colorPickerSettings.currentTab === "Decoration") {
        example.style.textDecorationColor = '';
        textAttributes.decorationColor = null;
      }

      if (needToLog) console.log('Сброс цвета. Текущее состояние textAttributes:', textAttributes);
    });
  }

  // -=-=-=-=-=-=-=-=-=- Кнопка применения -=-=-=-=-=-=-=-=-=- //
  const applyColorBtn = panelElement.querySelector('#zot-apply-color-btn');
  if (applyColorBtn) {
    applyColorBtn.addEventListener('click', () => {
      toggleColor(panelElement, textAttributes, true);
      if (needToLog) console.log('Цвет применён. Текущее состояние textAttributes:', textAttributes);
    });
  }

  // TODO: Листенер для ручного ввода hex-кода
  // TODO: Работа с пресетами
}