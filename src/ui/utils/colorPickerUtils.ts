import { TextAttributes } from "../textPanel/textPanel";
import { hsvToRgb, rgbToHex } from '../../utils/colorStyler';

const needToLog = false;

export const colorPickerSettings  = {
  currentTab : "Text",
  currentHue : 0,
  SVPicker : { x: 0, y: 0 , width: 0, height: 0},
}

// Применение цвета (при нажатии на кнопку применения цвета)
// Используется только в textPanel
// needToApply:
//      -- false: только визуально меняем части colorPicker-а
//      -- true: применяем цвет к превью, устанавливаем значение в атрибутах
export function toggleColor(
    panelElement: HTMLElement, 
    textAttributes: TextAttributes, 
    needToApply : boolean = false
) {
    const example = panelElement.querySelector('#zot-font-example') as HTMLElement;
    const hexInput = panelElement.querySelector('#zot-hex-input') as HTMLElement;
    const applyColorBtn = panelElement.querySelector('#zot-apply-color-btn') as HTMLElement;
  
    const x = colorPickerSettings.SVPicker.x;
    const y = colorPickerSettings.SVPicker.y;
    const width = colorPickerSettings.SVPicker.width;
    const height = colorPickerSettings.SVPicker.height;
  
    // Цвета (S и V в диапазоне 0...1)
    const saturation = x / width;
    const value = 1 - (y / height); // Инвертируем Y: верх = 1, низ = 0
  
    // Получаем итоговый rgb
    const selectedRgb = hsvToRgb(colorPickerSettings.currentHue, saturation, value);
    const selectedRgbString = `rgb(${selectedRgb.r}, ${selectedRgb.g}, ${selectedRgb.b})`;
    const seletedHexString = `${rgbToHex(selectedRgb.r, selectedRgb.g, selectedRgb.b)}`;
  
    const selectedRgbaString = `rgba(${selectedRgb.r}, ${selectedRgb.g}, ${selectedRgb.b}, ${9.0/16.0})`;
  
    if (needToApply) {
      if (colorPickerSettings.currentTab === "Text") {
        example.style.color = selectedRgbString;
        textAttributes.textColor = seletedHexString;
        if (needToLog) console.log('Текущее состояние textAttributes:', textAttributes);
      } else if (colorPickerSettings.currentTab === "Background") {
        example.style.backgroundColor = selectedRgbaString;
        textAttributes.backgroundColor = seletedHexString;
        if (needToLog) console.log('Текущее состояние textAttributes:', textAttributes);
      } else if (colorPickerSettings.currentTab === "Decoration") {
        example.style.textDecorationColor = selectedRgbString;
        textAttributes.decorationColor = seletedHexString;
      } else {
        console.warn('Неизвестная вкладка для выбора цвета:', colorPickerSettings.currentTab);
      }
    }
    
    hexInput.setAttribute('placeholder', seletedHexString.toUpperCase());
    applyColorBtn.style.setProperty('--current-color', selectedRgbString);
  
    const contrastRgb = hsvToRgb(colorPickerSettings.currentHue, 0, Math.round((1 - value)));
    applyColorBtn.style.color = `rgb(${contrastRgb.r}, ${contrastRgb.g}, ${contrastRgb.b})`
  }