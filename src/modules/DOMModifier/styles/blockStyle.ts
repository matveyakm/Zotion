import { ParsedData } from '../scanner';

export function applyBlockStyles(link: HTMLAnchorElement, parsedData: ParsedData, index: number): void {
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
      applyStylesToCallout(targetDiv, attributes, index);
    }
  } else if (quoteBlock) {
    // Для quote-block стили применяются к <div> внутри <blockquote>
    const targetDiv = quoteBlock.querySelector('blockquote > div');
    if (targetDiv instanceof HTMLElement) {
      applyStylesToQuote(targetDiv, attributes, index);
    }
  }
}

function parseRGB(hex: string): string | null {
  if (hex.length !== 7) return null;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const a = parseInt(hex[6], 16) / 16;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function applyStylesToCallout(element: HTMLElement, attributes: (string | null)[], index: number): void {
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
    const rgba = parseRGB(borderColor);
    if (rgba) borderColor = rgba;
  }

  if (attributes[3]) {
    borderWidth = parseInt(attributes[3], 16);
  }

  element.style.border = `${borderWidth}px solid ${borderColor}`;

  if (attributes[4]) {
    const bgColor = attributes[4].match(/[0-9a-fA-F]{7}/)?.[0];
    if (bgColor) {
        const rgba = parseRGB(bgColor);
        if (rgba) {
            element.style.backgroundColor = `${rgba}`;
        }
    }
  }
}

function applyStylesToQuote(element: HTMLElement, attributes: (string | null)[], index: number): void {
    console.log(`Applying styles for link ${index + 1} with attributes:`, attributes);
    var borderColor = getComputedStyle(element).borderInlineStart;
    var borderWidth = 3;
    if (attributes[2]) {
      borderColor = attributes[2].match(/[0-9a-fA-F]{7}/)?.[0] || 'NULL'; 
      const rgba = parseRGB(borderColor);
      if (rgba) borderColor = rgba;
    }
  
    if (attributes[3]) {
      borderWidth = parseInt(attributes[3], 16);
    }
  
    element.style.borderInlineStart = `${borderWidth}px solid ${borderColor}`;
  
    if (attributes[4]) {
      const bgColor = attributes[4].match(/[0-9a-fA-F]{7}/)?.[0];
      if (bgColor) {
        const rgba = parseRGB(bgColor);
        if (rgba) {
            element.style.backgroundColor = `${rgba}`;
        }
      }
    }
}