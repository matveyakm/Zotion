// scanner.ts

import { parseLinkAttributes } from './parser';
import { applyLinkStylesToText, applyTooltipStyles } from './style';
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

    if(parsedData.attributes && parsedData.attributes[0] == "1") return;

    processedLinks.add(link);

    if (!('attributes' in parsedData)) return;
    
    applyLinkStylesToText(link, parsedData, index);

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
        
        const parentBlock = link.closest('.notion-text-block') as HTMLElement | null;;
        applyTooltipStyles(tooltip, parentBlock); 
        document.body.appendChild(tooltip);

        let hideTimeout: number | null = null; 

        console.log(`Adding mouseenter/mouseleave listeners for link ${index + 1}, link element:`, link);
        link.style.pointerEvents = 'auto';
        
        console.log(`Adding mouseenter/mouseleave listeners for link ${index + 1}`);
        const addListeners = () => {
          link.addEventListener('mouseenter', (e) => {
          console.log(`Mouseenter triggered for link ${index + 1}, event:`, e);
          const rect = link.getBoundingClientRect();
          tooltip.style.top = `${rect.bottom + window.scrollY + 8}px`;
          tooltip.style.left = `${rect.left + window.scrollX}px`;
          tooltip.style.display = 'block';
          tooltip.style.opacity = '1';
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
  });
}