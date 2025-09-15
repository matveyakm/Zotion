// scanner.ts

import { parseLinkAttributes } from './parser';
import { applyLinkStylesToText } from './styles/textStyle';
import { processedBlocks, processedLinks } from './constants';
import { hideAnnotationBlock, createAnnotationTooltip } from './annotation/annotation';
import { applyBlockStyles } from './styles/blockStyle';
import { clearProcessedData } from './constants';

export const indexOfType = 0;
export const indexOfTagID = 13;
export const formattedTextType = "0";
export const annotationLinkType = "1";
export const annotationContentType = "2";
export const formattedBlockType = "3";

export var isDarkTheme = false;

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
     .notion-header-block a[href*="#"]:not([data-styled]),
     .notion-sub_header-block a[href*="#"]:not([data-styled]),
     .notion-sub_sub_header-block a[href*="#"]:not([data-styled])
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

  const actualIsDarkTheme = document.body.classList.contains('dark') || document.querySelector('.notion-dark-theme') !== null;
  if (actualIsDarkTheme !== isDarkTheme) {
    console.log(`Theme changed: was ${isDarkTheme ? 'Dark' : 'Light'}, now ${actualIsDarkTheme ? 'Dark' : 'Light'}`);
    clearProcessedData();
    isDarkTheme = actualIsDarkTheme;

  }

  console.log('Detected theme: ', isDarkTheme ? 'Dark' : 'Light');

  // Первый проход для скрытия блоков (контента аннотаций) и применения стилей
  links.forEach((link, index) => {
    const parsedData = processParsedData(link);
    if (!parsedData) return;
    if (parsedData.attributes[indexOfType] == annotationLinkType) return;
    processedLinks.add(link);
    
    applyLinkStylesToText(link, parsedData, index, isDarkTheme);
    if (parsedData.attributes[indexOfType] == formattedBlockType) {
      applyBlockStyles(link, parsedData, index, isDarkTheme);
    }

    // Обработка контента аннотаций
    if (parsedData.attributes[indexOfType] == annotationContentType) {
      hideAnnotationBlock(link, parsedData, index);
    }
  });

  // Второй проход для обработки аннотаций-ссылки
  links.forEach((link, index) => {
    const parsedData = processParsedData(link);
    processedLinks.add(link);
    if (!parsedData) return;
    
    applyLinkStylesToText(link, parsedData, index, isDarkTheme);

    // Обработка аннотации-ссылки
    if (parsedData.attributes[indexOfType] === annotationLinkType) {
      createAnnotationTooltip(link, parsedData, index, isDarkTheme);
    }
  });
}