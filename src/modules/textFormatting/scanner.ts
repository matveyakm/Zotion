// scanner.ts

import { parseLinkAttributes } from './parser';
import { applyLinkStylesToText } from './style';
import { processedLinks, hiddenBlocks } from './constants';

export function findStyledLinks(container: ParentNode = document): HTMLAnchorElement[] {
  const links = container.querySelectorAll<HTMLAnchorElement>(
    '.notion-text-block a[href*="#"]:not([data-styled]), .notion-text-block a[href^="//color=#"]:not([data-styled])'
  );
  return Array.from(links);
}

export function processTextStyleLinks(container: ParentNode = document): void {
  const links = findStyledLinks(container);

  const isDarkTheme = document.body.classList.contains('dark') || document.querySelector('.notion-dark-theme') !== null;

  console.log('Detected theme: ', isDarkTheme ? 'Dark' : 'Light');

  links.forEach((link, index) => {
    if (processedLinks.has(link)) return;

    const href = link.getAttribute('href');
    if (!href) return;

    const parsedData = parseLinkAttributes(href);
    if (!parsedData || ('attributes' in parsedData && !parsedData.attributes)) return;

    processedLinks.add(link);

    if (!('attributes' in parsedData)) return;
    
    applyLinkStylesToText(link, parsedData, index);

    if (parsedData.attributes[0] === "1") {
      const blockId = parsedData.attributes[13];
      console.log(`Checking annotation for link ${index + 1}, blockId=${blockId}, hiddenBlocks keys=${Array.from(hiddenBlocks.keys())}`);
      if (blockId && hiddenBlocks.has(blockId)) {
        const tooltip = document.createElement('div');
        tooltip.className = 'annotation-tooltip';
        tooltip.innerHTML = hiddenBlocks.get(blockId) || '';
        tooltip.style.position = 'absolute';
        tooltip.style.display = 'none';
        tooltip.style.backgroundColor = isDarkTheme ? 'rgba(33, 33, 33, 0.9)' : 'rgba(245, 245, 245, 0.9)';
        tooltip.style.border = isDarkTheme ? '1px solid #4A4A4A' : '1px solid #D3D3D3';
        tooltip.style.padding = '120px';
        tooltip.style.zIndex = '10000';
        tooltip.style.maxWidth = '3000px';
        tooltip.style.borderRadius = '6px'; // Скруглённые углы
        tooltip.style.boxShadow = isDarkTheme ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 4px 12px rgba(0, 0, 0, 0.2)';
        tooltip.style.color = isDarkTheme ? '#FFFFFF' : '#000000';
        tooltip.style.fontFamily = 'ui-sans-serif, system-ui, sans-serif'; // Шрифт в стиле Notion
        tooltip.style.fontSize = '14px';
        tooltip.style.lineHeight = '1.5';
        tooltip.style.transition = 'opacity 0.2s ease-in-out'; // Плавное появление
        tooltip.style.opacity = '0'; // Начальная прозрачность для анимации
        document.body.appendChild(tooltip);

          console.log(`Adding mouseenter/mouseleave listeners for link ${index + 1}, link element:`, link);
          link.style.pointerEvents = 'auto'; // Включаем события мыши
        
          console.log(`Adding mouseenter/mouseleave listeners for link ${index + 1}`);
          const addListeners = () => {
            link.addEventListener('mouseenter', (e) => {
              console.log(`Mouseenter triggered for link ${index + 1}, event:`, e);
              const rect = link.getBoundingClientRect();
              tooltip.style.top = `${rect.bottom + window.scrollY + 8}px`;
              tooltip.style.left = `${rect.left + window.scrollX}px`;
              tooltip.style.display = 'block';
              tooltip.style.opacity = '1';
              console.log(`Tooltip shown for link ${index + 1} at top=${tooltip.style.top}, left=${tooltip.style.left}, content=${tooltip.innerHTML}`);
            }, { capture: true });
  
            link.addEventListener('mouseleave', (e) => {
              console.log(`Mouseleave triggered for link ${index + 1}, event:`, e);
              tooltip.style.display = 'none';
              tooltip.style.opacity = '0';
              console.log(`Tooltip hidden for link ${index + 1}`);
            }, { capture: true });
          };
  
          addListeners();
        console.log(`Added annotation tooltip for link ${index + 1} with blockId=${blockId}`);
      } else {
        console.warn(`No hidden block found for blockId=${blockId} or missing attributes[13] for link ${index + 1}`);
      }
    }

    if (parsedData.attributes[0] == "2") {
      if (!parsedData.attributes[13]) {
        console.warn(`Format of attributes is not correct for link ${index + 1}`);
        return;
      }

      const blockId = parsedData.attributes[13];
      if (!blockId) {
        console.warn(`Cant found blockID for link ${index + 1}`);
        return;
      }

      const block = link.closest('[data-block-id]');
      if (!block) {
        console.warn(`No block with data-block-id found for link ${index + 1}`);
        return;
      }
        
      hiddenBlocks.set(blockId, block.outerHTML);
      block.style.display = 'none';
      console.log(`Hidden block with data-block-id=${block.getAttribute('data-block-id')} and saved with key=${blockId} for link ${index + 1}`);
    }
  });
}