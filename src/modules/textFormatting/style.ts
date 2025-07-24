// style.ts

import { processedLinks } from './constants';

interface ParsedData {
  legacyColor?: string;
  attributes?: string[];
}

export function applyLinkStylesToText(link: HTMLAnchorElement, parsedData: ParsedData, index: number): void {
  processedLinks.add(link);
  link.setAttribute('data-styled', 'true');
  console.log(`Processing link ${index + 1}`);

  link.style.textDecoration = 'none';
  link.style.cursor = 'text';
  link.style.pointerEvents = 'none';
  link.removeAttribute('tabindex');
  link.classList.remove('notion-focusable-token', 'notion-enable-hover');

  link.style.position = 'relative';
  link.setAttribute('data-icon', 'true');

  const span = link.querySelector('span');
  if (span) {
    span.style.borderBottom = 'none';
    span.style.opacity = '1';
  }

  if (parsedData.legacyColor) {
    console.log(`Applying legacy color: #${parsedData.legacyColor}`);
    link.style.color = `#${parsedData.legacyColor}`;
    console.log(`Processed legacy color link ${index + 1}`);
    return;
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

  if (attributes[1]) {
    const size = parseInt(attributes[1], 16);
    link.style.fontSize = fontSizes[size] || '16px';
  }

  if (attributes[2]) {
    const color = attributes[2].match(/[0-9a-fA-F]{6}/)?.[0];
    if (color) link.style.color = `#${color}`;
  }

  if (attributes[3]) {
    const bgColor = attributes[3].match(/[0-9a-fA-F]{6}/)?.[0];
    if (bgColor) link.style.backgroundColor = `#${bgColor}`;
  }

  if (attributes[4]) {
    const dec = parseInt(attributes[4], 16);
    link.style.textDecoration = decorations[dec] || 'none';
  }

  if (attributes[5]) {
    const decColor = attributes[5].match(/[0-9a-fA-F]{6}/)?.[0];
    if (decColor) link.style.textDecorationColor = `#${decColor}`;
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
    link.style.letterSpacing = `${spacing - 5}px`;
  }

  if (attributes[9]) {
    const spacing = parseInt(attributes[9], 16);
    link.style.wordSpacing = `${spacing - 5}px`;
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

export function applyLinkStylesToInfoBlock(link: HTMLAnchorElement, parsedData: ParsedData, index: number): void {
  if (processedLinks.has(link)) {
    console.log(`Link ${index + 1} already processed, skipping`);
    return;
  }

  processedLinks.add(link);
  link.setAttribute('data-styled', 'true');

  const originalHref = link.href;
  link.dataset.originalHref = originalHref;

  console.log(`Processing link ${index + 1}, href: ${originalHref}, original text: ${link.textContent}`);

  let emojiSpan = link.querySelector('span[class*="link-annotation"]') as HTMLSpanElement | null;

  if (!emojiSpan) {
    console.log(`No link-annotation span found in link ${index + 1}, creating new`);
    emojiSpan = document.createElement('span');
    const blockId = link.closest('[data-block-id]')?.getAttribute('data-block-id') || 'unknown';
    emojiSpan.className = `emoji-container link-annotation-${blockId}-${index}`;
    link.innerHTML = '';
    link.appendChild(emojiSpan);
  } else {
    console.log(`Found existing span in link ${index + 1}:`, emojiSpan.outerHTML);
    emojiSpan.classList.add('emoji-container');
  }

  emojiSpan.textContent = 'ℹ️';
  emojiSpan.style.display = 'inline-block';
  emojiSpan.style.position = 'relative';
  emojiSpan.style.width = '24px';
  emojiSpan.style.height = '24px';
  emojiSpan.style.lineHeight = '24px';
  emojiSpan.style.verticalAlign = 'middle';
  emojiSpan.style.opacity = '0.7';
  emojiSpan.style.fontSize = '0';

  const fontSizes = [
    '8px', '9px', '10px', '11px', '12px', '13px', '14px', '15px',
    '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px'
  ];

  if (link.href !== originalHref) {
    link.href = originalHref;
    console.log(`Restored href for link ${index + 1}: ${link.href}`);
  }

  if (parsedData.legacyColor) {
    link.style.color = `#${parsedData.legacyColor}`;
    console.log(`Applied legacy color #${parsedData.legacyColor} to link ${index + 1}`);
    return;
  }

  const attributes = parsedData.attributes;
  if (!attributes) {
    console.log(`No attributes in parsedData for link ${index + 1}`);
    return;
  }

  if (attributes[1]) {
    const size = parseInt(attributes[1], 16);
    const iconSize = fontSizes[size] || '24px';
    emojiSpan.style.width = iconSize;
    emojiSpan.style.height = iconSize;
    console.log(`Set size ${iconSize} for link ${index + 1}`);
  }

  if (attributes[2]) {
    const color = attributes[2].match(/[0-9a-fA-F]{6}/)?.[0];
    if (color) {
      link.style.color = `#${color}`;
      console.log(`Set color #${color} for link ${index + 1}`);
    }
  }

  if (attributes[3]) {
    const bgColor = attributes[3].match(/[0-9a-fA-F]{6}/)?.[0];
    if (bgColor) {
      link.style.backgroundColor = `#${bgColor}`;
      console.log(`Set background color #${bgColor} for link ${index + 1}`);
    }
  }

  console.log(`Finished processing link ${index + 1}, final HTML:`, link.outerHTML);
}
