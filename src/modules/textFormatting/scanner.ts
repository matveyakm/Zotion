// scanner.ts

import { parseLinkAttributes } from './parser';
import { applyLinkStylesToText } from './style';
import { processedLinks } from './constants';

export function findStyledLinks(container: ParentNode = document): HTMLAnchorElement[] {
  const links = container.querySelectorAll<HTMLAnchorElement>(
    '.notion-text-block a[href*="#"]:not([data-styled]), .notion-text-block a[href^="//color=#"]:not([data-styled])'
  );
  return Array.from(links);
}

export function processTextStyleLinks(container: ParentNode = document): void {
  const links = findStyledLinks(container);

  links.forEach((link, index) => {
    if (processedLinks.has(link)) return;

    const href = link.getAttribute('href');
    if (!href) return;

    const parsedData = parseLinkAttributes(href);
    if (!parsedData || ('attributes' in parsedData && !parsedData.attributes)) return;

    processedLinks.add(link);

    if (!('attributes' in parsedData)) return;
    
    applyLinkStylesToText(link, parsedData, index);

    switch (parsedData.attributes[0]) {
      case '1':
        break;
      case '2':
        const block = link.closest('[data-block-id]');
        if (block) {
          block.setAttribute('data-original-html', block.outerHTML);
          block.style.display = 'none';
          console.log(`Hidden block with data-block-id=${block.getAttribute('data-block-id')} for link ${index + 1}`);
        } else {
          console.warn(`No block with data-block-id found for link ${index + 1}`);
        }
        break;
      default:
        break;
    }
    
  });
}