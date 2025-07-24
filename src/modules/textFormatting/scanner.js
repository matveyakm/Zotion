import { parseLinkAttributes } from './parser.js';
import { applyLinkStylesToText, applyLinkStylesToInfoBlock } from './style.js';
import { processedLinks } from './constants.js';

export function findStyledLinks(container = document) {
  const links = container.querySelectorAll('.notion-text-block a[href*="#"]:not([data-styled]), .notion-text-block a[href^="//color=#"]:not([data-styled])');
  return Array.from(links);
}

export function processTextStyleLinks(container = document) {
  const links = findStyledLinks(container);
  links.forEach((link, index) => {
    if (processedLinks.has(link)) return;
    const href = link.getAttribute('href');
    const parsedData = parseLinkAttributes(href);
    if (parsedData) {
      if (parsedData.attributes?.[0] === "1") {
        applyLinkStylesToInfoBlock(link, parsedData, index);
      } else {
        applyLinkStylesToText(link, parsedData, index);
      }
    }
  });
}
