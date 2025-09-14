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
      applyStylesToBlock(targetDiv, attributes, index);
    }
  } else if (quoteBlock) {
    // Для quote-block стили применяются к <div> внутри <blockquote>
    const targetDiv = quoteBlock.querySelector('blockquote > div');
    if (targetDiv instanceof HTMLElement) {
      applyStylesToBlock(targetDiv, attributes, index);
    }
  }

  console.log(`Processed block styles for link ${index + 1}`);
}

function applyStylesToBlock(element: HTMLElement, attributes: (string | null)[], index: number): void {
  if (attributes[1]) {
    const radius = parseInt(attributes[1], 16) + 10;
    if (!isNaN(radius)) {
      element.style.borderRadius = `${radius}px`;
      element.style.paddingInline = `${10 + radius}px`;
      element.style.paddingTop = `${2 + radius}px`;
      element.style.paddingBottom = `${2 +radius}px`;
    }
  }

  var borderColor = getComputedStyle(element).borderColor;
  var borderWidth = 1;
  if (attributes[2]) {
    borderColor = attributes[2].match(/[0-9a-fA-F]{6}/)?.[0] || 'D4D4D4'; 
  }

  if (attributes[3]) {
    borderWidth = parseInt(attributes[3], 16);
  }

  element.style.border = `${borderWidth}px solid #${borderColor}`;

  if (attributes[4]) {
    const bgColor = attributes[4].match(/[0-9a-fA-F]{6}/)?.[0];
    if (bgColor) {
      element.style.backgroundColor = `#${bgColor}`;
    }
  }
}