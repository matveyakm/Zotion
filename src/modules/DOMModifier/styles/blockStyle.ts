import { ParsedData } from '../scanner';
import { parseRGB } from './style';

export function applyBlockStyles(link: HTMLAnchorElement, parsedData: ParsedData, index: number, isDarkTheme: boolean): void {
  console.log(`Trying to apply block styles for link ${index + 1}`);

  const attributes = parsedData.attributes;
  if (!attributes) return;

  // Найти ближайший родительский блок
  const calloutBlock = link.closest('.notion-callout-block');
  const quoteBlock = link.closest('.notion-quote-block');

  if (calloutBlock) {
    // Для callout-block стили применяются к <div> внутри <div role="note">
    const targetDiv = calloutBlock.querySelector('div[role="note"] > div');
    if (targetDiv instanceof HTMLElement) {
      applyStylesToCallout(targetDiv, attributes, index, isDarkTheme);
    }
  } else if (quoteBlock) {
    // Для quote-block стили применяются к <div> внутри <blockquote>
    const targetDiv = quoteBlock.querySelector('blockquote > div');
    if (targetDiv instanceof HTMLElement) {
      applyStylesToQuote(targetDiv, attributes, index, isDarkTheme);
    }
  }
}

function applyStylesToCallout(element: HTMLElement, attributes: (string | null)[], index: number, isDarkTheme: boolean): void {
    console.log(`Applying styles for link ${index + 1} with attributes:`, attributes);
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
    const rgba = parseRGB(borderColor, isDarkTheme);
    if (rgba) borderColor = rgba;
  }

  if (attributes[3]) {
    borderWidth = parseInt(attributes[3], 16);
  }

  element.style.border = `${borderWidth}px solid ${borderColor}`;

  if (attributes[4]) {
    const bgColor = attributes[4].match(/[0-9a-fA-F]{7}/)?.[0];
    if (bgColor) {
        const rgba = parseRGB(bgColor, isDarkTheme);
        if (rgba) {
            element.style.backgroundColor = `${rgba}`;
        }
    }
  }
}

function applyStylesToQuote(element: HTMLElement, attributes: (string | null)[], index: number, isDarkTheme: boolean): void {
    console.log(`Applying styles for link ${index + 1} with attributes:`, attributes);

    element.style.paddingTop = '3px';
    element.style.paddingBottom = '3px';

    var borderColor = getComputedStyle(element).borderInlineStart;
    var borderWidth = 3;
    if (attributes[2]) {
      borderColor = attributes[2].match(/[0-9a-fA-F]{7}/)?.[0] || 'NULL'; 
      const rgba = parseRGB(borderColor, isDarkTheme);
      if (rgba) borderColor = rgba;
    }
  
    if (attributes[3]) {
      borderWidth = parseInt(attributes[3], 16);
    }
  
    element.style.borderInlineStart = `${borderWidth}px solid ${borderColor}`;
  
    if (attributes[4]) {
      const bgColor = attributes[4].match(/[0-9a-fA-F]{7}/)?.[0];
      if (bgColor) {
        const rgba = parseRGB(bgColor, isDarkTheme);
        if (rgba) {
            element.style.backgroundColor = `${rgba}`;
        }
      }
    }
}