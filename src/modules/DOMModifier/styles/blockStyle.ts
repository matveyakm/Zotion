import { ParsedData } from '../scanner';
import { processRGB } from './colorStyler';
import { applyAlignmentStyles } from './alignmentStyle';

export function applyBlockStyles(link: HTMLAnchorElement, parsedData: ParsedData, index: number, isDarkTheme: boolean): void {
  console.log(`Trying to apply block styles for link ${index + 1}`);

  const attributes = parsedData.attributes;
  if (!attributes) return;

  const calloutBlock = link.closest('.notion-callout-block');
  const quoteBlock = link.closest('.notion-quote-block');
  const tableBlock = link.closest('.notion-table-block');

  if (calloutBlock) {
    const targetDiv = calloutBlock.querySelector('div[role="note"] > div');
    if (targetDiv instanceof HTMLElement) {
      applyStylesToCallout(targetDiv, attributes, index, isDarkTheme);
    }
  } else if (quoteBlock) {
    const targetDiv = quoteBlock.querySelector('blockquote > div');
    if (targetDiv instanceof HTMLElement) {
      applyStylesToQuote(targetDiv, attributes, index, isDarkTheme);
    }
  } else if (tableBlock) {
    applyStylesToTable(link, attributes, index, isDarkTheme);
  }
}

function applyStylesToCallout(element: HTMLElement, attributes: (string | null)[], index: number, isDarkTheme: boolean): void {
    console.log(`Applying styles (block) for link ${index + 1}`);
    if (attributes[1]) {
    const radius = parseInt(attributes[1], 16) * 2 + 10;
    if (!isNaN(radius)) {
      element.style.borderRadius = `${radius}px`;
      element.style.paddingInline = `${7 + 0.1 * radius}px`;
      element.style.paddingTop = `${9 + 0.1 * radius}px`;
      element.style.paddingBottom = `${9 + 0.1 * radius}px`;
    }
  }

  var borderColor = getComputedStyle(element).borderColor;
  var borderWidth = 1;
  if (attributes[2]) {
    borderColor = attributes[2].match(/[0-9a-fA-F]{7}/)?.[0] || 'NULL';
    const rgba = processRGB(borderColor, isDarkTheme ? "dark" : "light", "full");
    if (rgba) borderColor = rgba;
  }

  if (attributes[3]) {
    borderWidth = parseInt(attributes[3], 16);
  }

  element.style.border = `${borderWidth}px solid ${borderColor}`;

  if (attributes[4]) {
    const bgColor = attributes[4].match(/[0-9a-fA-F]{7}/)?.[0];
    if (bgColor) {
        const rgba = processRGB(bgColor, isDarkTheme ? "light" : "dark", "simple"); // Обратный фон для лучшей видимости
        if (rgba) {
            element.style.backgroundColor = `${rgba}`;
        }
    }
  }

  if (attributes[5] || attributes[6])
    applyAlignmentStyles(element, attributes[5], attributes[6], index, element.getAttribute('data-link-id') || '');
}

function applyStylesToQuote(element: HTMLElement, attributes: (string | null)[], index: number, isDarkTheme: boolean): void {
    console.log(`Applying styles for link ${index + 1} with attributes:`, attributes);

    element.style.paddingTop = '3px';
    element.style.paddingBottom = '3px';

    var borderColor = getComputedStyle(element).borderInlineStart;
    var borderWidth = 3;
    if (attributes[2]) {
      borderColor = attributes[2].match(/[0-9a-fA-F]{7}/)?.[0] || 'NULL'; 
      const rgba = processRGB(borderColor, isDarkTheme ? "dark" : "light", "full");
      if (rgba) borderColor = rgba;
    }
  
    if (attributes[3]) {
      borderWidth = parseInt(attributes[3], 16);
    }
  
    element.style.borderInlineStart = `${borderWidth}px solid ${borderColor}`;
  
    if (attributes[4]) {
      const bgColor = attributes[4].match(/[0-9a-fA-F]{7}/)?.[0];
      if (bgColor) {
        const rgba = processRGB(bgColor, isDarkTheme ? "light" : "dark", "simple"); // Обратный фон для лучшей видимости
        if (rgba) {
            element.style.backgroundColor = `${rgba}`;
        } 
      }
    }
    
    if (attributes[5] || attributes[6])
      applyAlignmentStyles(element, attributes[5], attributes[6], index, element.getAttribute('data-link-id') || '');
}

function applyStylesToTable(link: HTMLAnchorElement, attributes: (string | null)[], index: number, isDarkTheme: boolean): void {
  console.log(`Applying styles (table) for link ${index + 1} with attributes:`, attributes);

  const targetCell = link.closest('td');
  if (targetCell instanceof HTMLElement) {
    const linkId = `link-${index}-${Date.now()}`;
    link.setAttribute('data-link-id', linkId);
    
    if (attributes[2]) {
      const bgColor = attributes[2].match(/[0-9a-fA-F]{7}/)?.[0];
      if (bgColor) {
        const rgba = processRGB(bgColor, isDarkTheme ? "light" : "dark", "simple"); // Обратный фон для лучшей видимости
        if (rgba) {
          targetCell.style.backgroundColor = rgba;
        }
      }
    }

    let borderColor = 'var(--c-tabDivCol)';
    let borderWidth = 1;

    if (attributes[4]) {
      borderColor = attributes[4].match(/[0-9a-fA-F]{7}/)?.[0] || 'NULL';
      const rgba = processRGB(borderColor, isDarkTheme ? "dark" : "light", "full");
      if (rgba) borderColor = rgba;
    }

    if (attributes[3]) {
      borderWidth = parseInt(attributes[3], 16);
    }
    
    targetCell.style.border = ''; 
    targetCell.style.setProperty('border', `${borderWidth}px solid ${borderColor}`, 'important');

    let textAlign = 'left';
    if (attributes[5]) {
      const textAlignMap: { [key: string]: string } = {
        '0': 'left',
        '1': 'center',
        '2': 'right'
      };
      textAlign = textAlignMap[attributes[5]] || 'left';
    }

    let verticalAlign = 'top';
    if (attributes[6]) {
      const verticalAlignMap: { [key: string]: string } = {
        '0': 'top',
        '1': 'middle',
        '2': 'bottom'
      };
      verticalAlign = verticalAlignMap[attributes[6]] || 'top';
      targetCell.style.verticalAlign = verticalAlign;
    }

    const styleSheet = document.createElement('style');
    styleSheet.textContent = `.notion-table-row td:has(a[data-link-id="${linkId}"]) { 
      border: ${borderWidth}px solid ${borderColor} !important; 
      background-color: ${targetCell.style.backgroundColor || 'transparent'} !important; 
      text-align: ${textAlign} !important; 
      vertical-align: ${verticalAlign} !important; 
    }`;
    document.head.appendChild(styleSheet);
  } else {
    console.log(`Link ${index + 1} - Target cell (td) not found`);
  }
}