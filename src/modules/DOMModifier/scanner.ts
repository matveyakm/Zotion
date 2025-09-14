// scanner.ts

import { parseLinkAttributes } from './parser';
import { applyLinkStylesToText } from './styles/textStyle';
import { processedLinks } from './constants';
import { hideAnnotationBlock, createAnnotationTooltip } from './annotation/annotation';

const indexOftype = 0;
const annotationLinkType = "1";
const annotationContentType = "2";

export interface ParsedData {
  attributes: string[];
}

export function findStyledLinks(container: ParentNode = document): HTMLAnchorElement[] {
  const links = container.querySelectorAll<HTMLAnchorElement>(
    `.notion-text-block a[href*="#"]:not([data-styled]),
     .notion-table-block a[href*="#"]:not([data-styled]),
     .notion-quote-block a[href*="#"]:not([data-styled]),
     .notion-toggle-block a[href*="#"]:not([data-styled]),
     .notion-bulleted_list-block a[href*="#"]:not([data-styled]),
     .notion-numbered_list-block a[href*="#"]:not([data-styled]),
     .notion-callout-block a[href*="#"]:not([data-styled]),
     .notion-header-block a[href*="#"]:not([data-styled]),
     .notion-sub_header-block a[href*="#"]:not([data-styled]),
     .notion-sub_sub_header-block a[href*="#"]:not([data-styled]),
     .notion-header-block a[href^="//color=#"]:not([data-styled]),
     .notion-sub_header-block a[href^="//color=#"]:not([data-styled]),
     .notion-sub_sub_header-block a[href^="//color=#"]:not([data-styled])
    `
  );
  return Array.from(links);
}

function processParsedData(link: HTMLAnchorElement): ParsedData | null {
  if (processedLinks.has(link)) return null;

  const href = link.getAttribute('href');
  if (!href) return null;

  const parsedData = parseLinkAttributes(href);
  if (!parsedData || ('attributes' in parsedData && !parsedData.attributes)) return null;

  if (!('attributes' in parsedData)) {
    processedLinks.add(link);
    return null;
  }
  return parsedData
}

export function processAttributedLinks(container: ParentNode = document): void {
  const links = findStyledLinks(container);

  const isDarkTheme = document.body.classList.contains('dark') || document.querySelector('.notion-dark-theme') !== null;

  console.log('Detected theme: ', isDarkTheme ? 'Dark' : 'Light');

  // Первый проход для скрытия блоков (контента аннотаций) и применения стилей
  links.forEach((link, index) => {
    const parsedData = processParsedData(link);
    if (!parsedData) return;
    if (parsedData.attributes[indexOftype] == annotationLinkType) return;
    processedLinks.add(link);
    
    applyLinkStylesToText(link, parsedData, index);

    // Обработка контента аннотаций
    if (parsedData.attributes[indexOftype] == annotationContentType) {
      hideAnnotationBlock(link, parsedData, index);
    }
  });

  // Второй проход для обработки аннотаций-ссылки
  links.forEach((link, index) => {
    const parsedData = processParsedData(link);
    processedLinks.add(link);
    if (!parsedData) return;
    
    applyLinkStylesToText(link, parsedData, index);

    // Обработка аннотации-ссылки
    if (parsedData.attributes[indexOftype] === annotationLinkType) {
      createAnnotationTooltip(link, parsedData, index, isDarkTheme);
    }
  });
}