import { ParsedData } from '../scanner';
import { processRGB } from './colorStyler';

export function applyDividerStyles(link: HTMLAnchorElement, parsedData: ParsedData, index: number, isDarkTheme: boolean): void {
  console.log(`Applying divider styles for link ${index + 1}, attributes:`, parsedData.attributes);

  const attributes = parsedData.attributes;
  if (!attributes) {
    console.log(`Link ${index + 1} - No attributes found`);
    return;
  }

  const textBlock = link.closest('.notion-text-block');
  if (!(textBlock instanceof HTMLElement)) {
    console.log(`Link ${index + 1} - notion-text-block not found`);
    return;
  }
  textBlock.style.display = 'none';

  const dividerBlock = textBlock.nextElementSibling?.closest('.notion-divider-block');
  if (!(dividerBlock instanceof HTMLElement)) {
    console.log(`Link ${index + 1} - notion-divider-block not found`);
    return;
  }

  const separator = dividerBlock.querySelector('div[role="separator"]');
  if (!(separator instanceof HTMLElement)) {
    console.log(`Link ${index + 1} - Separator element not found`);
    return;
  }

  // Добавляем уникальный атрибут для селектора
  const linkId = `link-${index}-${Date.now()}`;
  link.setAttribute('data-link-id', linkId);
  separator.setAttribute('data-divider-id', linkId);

  let borderWidth = 1;
  let borderColor = getComputedStyle(separator).borderBottomColor;

  if (attributes[1]) {
    borderWidth = parseInt(attributes[1], 16);
    if (isNaN(borderWidth)) {
      console.log(`Link ${index + 1} - Invalid border width:`, attributes[1]);
      borderWidth = 1;
    }
  }

  if (attributes[2]) {
    let hexColor = attributes[2].match(/[0-9a-fA-F]{7}/)?.[0] || 'NULL';
    const rgba = processRGB(hexColor, isDarkTheme ? 'dark' : 'light', 'full');
    if (rgba) {
        borderColor = rgba;
    }
  }

  separator.style.borderBottom = ''; 
  separator.style.setProperty('border-bottom', `${borderWidth}px solid ${borderColor}`, 'important');
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .notion-divider-block div[role="separator"][data-divider-id="${linkId}"] { 
      border-bottom: ${borderWidth}px solid ${borderColor} !important; 
    }
    .notion-text-block:has(a[data-link-id="${linkId}"]) {
      display: none !important;
    }`;
  document.head.appendChild(styleSheet);
}