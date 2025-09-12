// style.ts

import { processedLinks } from './constants';

interface ParsedData {
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

export function applyTooltipStyles(tooltip: HTMLElement, parentBlock: HTMLElement | null): void {
  const isDarkTheme = document.body.classList.contains('dark') || document.querySelector('.notion-dark-theme') !== null;
  console.log('Tooltip theme: ', isDarkTheme ? 'Dark' : 'Light');

  const isMobile = window.innerWidth < 600;
  console.log('Tooltip device type: ', isMobile ? 'Mobile' : 'Desktop');

  const blockWidth = parentBlock ? parentBlock.getBoundingClientRect().width : 600; 
  const maxWidth = Math.min(blockWidth, isMobile? 400: 1920);

  tooltip.style.position = 'absolute';
  tooltip.style.display = 'none';
  tooltip.style.backgroundColor = isDarkTheme ? 'rgba(33, 33, 33, 0.95)' : 'rgba(245, 245, 245, 0.95)';
  tooltip.style.border = isDarkTheme ? '1px solid #4A4A4A' : '1px solid #D3D3D3';
  tooltip.style.padding = isMobile ? '8px' : '12px';
  tooltip.style.zIndex = '10000';
  tooltip.style.maxWidth = `${maxWidth}px`;
  tooltip.style.minWidth = isMobile ? '80px' : '100px'; 
  tooltip.style.borderRadius = '6px';
  tooltip.style.boxShadow = isDarkTheme ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.2)';
  tooltip.style.color = isDarkTheme ? '#FFFFFF' : '#000000';
  tooltip.style.fontFamily = 'ui-sans-serif, system-ui, sans-serif';
  tooltip.style.fontSize = isMobile ? '12px' : '14px';
  tooltip.style.lineHeight = '1.5';
  tooltip.style.transition = 'opacity 0.2s ease-in-out';
  tooltip.style.opacity = '0';
  tooltip.style.whiteSpace = 'normal'; 
  tooltip.style.height = 'auto'; 
  tooltip.style.maxHeight = isMobile ? '200px' : '500px'; 
  tooltip.style.overflowY = 'auto';
}