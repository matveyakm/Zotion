// style.ts

import { processedLinks } from '../constants';
import { ParsedData, indexOfType, formattedTextType, annotationContentType, formattedBlockType} from '../scanner';
import { parseRGB } from './style';

export function applyLinkStylesToText(link: HTMLAnchorElement, parsedData: ParsedData, index: number, isDarkTheme: boolean): void {
  processedLinks.add(link);
  link.setAttribute('data-styled', 'true');
  console.log(`Processing link ${index + 1}`);

  link.style.textDecoration = 'none';
  link.style.cursor = 'text';
  link.style.pointerEvents = 'none';
  link.removeAttribute('tabindex');
  link.classList.remove('notion-focusable-token', 'notion-enable-hover');

  link.style.position = 'relative';

  const span = link.querySelector('span');
  if (span) {
    span.style.borderBottom = 'none';
    span.style.opacity = '1';
  }

  const attributes = parsedData.attributes;
  if (!attributes) return;

  console.log(`Applying styles for link ${index + 1} with attributes:`, attributes);

  const fontSizes = [
    '8px', '9px', '10px', '11px', '12px', '13px', '14px', '15px',
    '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px'
  ];

  const decorations = [
    'none', 'underline', 'overline', 'line-through', 'underline overline'
  ];

  const styles = ['normal', 'italic', 'oblique'];
  const weights = ['normal', 'bold', 'lighter', 'bolder'];
  const spaces = ['normal', 'nowrap', 'pre'];
  const aligns = ['baseline', 'sub', 'super', 'middle', 'top', 'bottom'];

  if (attributes[indexOfType] == annotationContentType) {
    link.setAttribute('data-icon', 'true');
  }

  if (span && attributes[indexOfType] == formattedTextType) {
    span.style.textDecoration = 'none';
  }

  if (attributes[indexOfType] == formattedBlockType) {
    link.style.fontSize = '1px';
    link.style.color = 'transparent';
    if (span) span.style.textDecoration = 'none';
    return;
  }

  if (attributes[1]) {
    const size = parseInt(attributes[1], 16);
    link.style.fontSize = fontSizes[size] || '16px';
  }

  if (attributes[2]) {
    const color = attributes[2].match(/[0-9a-fA-F]{6}/)?.[0];
    if (color) {
      const rgb = parseRGB(color, isDarkTheme);
      if (rgb) link.style.color = rgb;
    }
  }

  if (attributes[3]) {
    const bgColor = attributes[3].match(/[0-9a-fA-F]{6}/)?.[0];
    if (bgColor) {
      const rgba = parseRGB(bgColor + "9", isDarkTheme);
      if (rgba) link.style.backgroundColor = rgba;
    }
  }

  if (attributes[4]) {
    const dec = parseInt(attributes[4], 16);
    link.style.textDecoration = decorations[dec] || 'none';
  }

  if (attributes[5]) {
    const decColor = attributes[5].match(/[0-9a-fA-F]{6}/)?.[0];
    if (decColor) {
      const rgba = parseRGB(decColor + "9", isDarkTheme);
      if (rgba) link.style.textDecorationColor = rgba;
    }
  }

  if (attributes[6]) {
    const style = parseInt(attributes[6], 16);
    link.style.fontStyle = styles[style] || 'normal';
  }

  if (attributes[7]) {
    const weight = parseInt(attributes[7], 16);
    link.style.fontWeight = weights[weight] || 'normal';
  }

  if (attributes[8]) {
    const spacing = parseInt(attributes[8], 16);
    if (!isNaN(spacing)) {
      link.style.letterSpacing = `${spacing - 5}px`;
    }
  }

  if (attributes[9]) {
    const spacing = parseInt(attributes[9], 16);
    if (!isNaN(spacing)) {
      link.style.wordSpacing = `${spacing - 5}px`;
    }
  }

  if (attributes[10]) {
    const ws = parseInt(attributes[10], 16);
    link.style.whiteSpace = spaces[ws] || 'normal';
  }

  if (attributes[11]) {
    const dir = parseInt(attributes[11], 16);
    link.style.direction = dir === 1 ? 'rtl' : 'ltr';
  }

  if (attributes[12]) {
    const va = parseInt(attributes[12], 16);
    link.style.verticalAlign = aligns[va] || 'baseline';
  }

  console.log(`Processed styled link ${index + 1} with styles applied`);
}

