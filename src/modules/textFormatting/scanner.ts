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

    if ('attributes' in parsedData) {
      applyLinkStylesToText(link, parsedData, index);
    }
  });
}