// annotationStyle.ts

import { addTooltipListeners } from '../annotation/tooltip';
import { hiddenBlocks } from '../constants';

export function applyTooltipStyles(
  tooltip: HTMLElement,
  parentBlock: HTMLElement | null,
  isDarkTheme: boolean,
  closeButton: HTMLElement
): void { 
  const isMobile = window.innerWidth < 600;
  console.log('Tooltip device type: ', isMobile ? 'Mobile' : 'Desktop');

  const blockWidth = parentBlock ? parentBlock.getBoundingClientRect().width : 600;
  const maxWidth = Math.min(blockWidth, isMobile ? 400 : 1920);

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

  closeButton.style.position = 'absolute';
  closeButton.style.top = '2px';
  closeButton.style.right = '2px';
  closeButton.style.fontSize = '12px';
  closeButton.style.fontWeight = 'bold';
  closeButton.style.color = isDarkTheme ? '#A4A4A4' : '#222222';
  closeButton.style.cursor = 'pointer';
  closeButton.style.padding = '2px 4px';
  closeButton.style.lineHeight = '1';
}

export function createTooltip(
  link: HTMLAnchorElement,
  blockId: string,
  parentBlock: HTMLElement | null,
  index: number,
  isDarkTheme: boolean
): void {
  const tooltip: HTMLDivElement = document.createElement('div');
  tooltip.className = 'annotation-tooltip';
  tooltip.innerHTML = hiddenBlocks.get(blockId) || '';

  const closeButton: HTMLSpanElement = document.createElement('span');
  closeButton.innerHTML = '×';
  closeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    tooltip.style.display = 'none';
    tooltip.style.opacity = '0';
    console.log(`Tooltip closed via X button for link ${index + 1}`);
  });
  tooltip.appendChild(closeButton);

  applyTooltipStyles(tooltip, parentBlock, isDarkTheme, closeButton);
  document.body.appendChild(tooltip);

  console.log(`Adding tooltip listeners for link ${index + 1}, link element:`, link);
  link.style.pointerEvents = 'auto';

  addTooltipListeners(link, tooltip, index);
}