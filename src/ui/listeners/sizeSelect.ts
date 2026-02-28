import { textAttributes } from "./../panel";

const fontSizes = [
    '8px', '9px', '10px', '11px', '12px', '13px', '14px', '15px',
    '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px'
];

export function setupSizeSelectionListener(panelElement: HTMLElement, example: HTMLElement) {
  const sizeSelect = panelElement.querySelector('#zot-font-size-select') as HTMLSelectElement | null;
  if (sizeSelect) {
    sizeSelect.addEventListener('change', () => {
      const selectedValue = parseInt(sizeSelect.value || "16", 10);
      textAttributes.size = fontSizes.indexOf(`${selectedValue}px`);

      if (!isNaN(selectedValue)) {
        if (selectedValue <= 20) {
          example.style.fontSize = `${selectedValue}px`;
        } else {
          example.style.fontSize = '20px';
        }
      }
      console.log('Обновлено textAttributes.size:', textAttributes.size);
      console.log('Текущее состояние textAttributes:', textAttributes);
    });
  }
}