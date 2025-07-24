// scanner.ts

import { parseLinkAttributes } from './parser';
import { applyLinkStylesToText, applyLinkStylesToInfoBlock } from './style';
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
    if (parsedData) {
      if ('attributes' in parsedData && parsedData.attributes?.[0] === "1") {
        applyLinkStylesToInfoBlock(link, parsedData, index);
      } else {
        applyLinkStylesToText(link, parsedData, index);
      }
    }
  });
}
