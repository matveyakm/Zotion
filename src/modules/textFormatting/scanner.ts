import { parseLinkAttributes } from './parser';
import { applyLinkStylesToText, createTooltip } from './style';
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

  // Первый проход для скрытия блоков и применения стилей
  links.forEach((link, index) => {
    if (processedLinks.has(link)) return;

    const href = link.getAttribute('href');
    if (!href) return;

    const parsedData = parseLinkAttributes(href);
    if (!parsedData || ('attributes' in parsedData && !parsedData.attributes)) return;

    if (parsedData.attributes && parsedData.attributes[0] == "1") return;

    processedLinks.add(link);

    if (!('attributes' in parsedData)) return;
    
    applyLinkStylesToText(link, parsedData, index);

    // Обработка контента аннотаций
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

      const block = link.closest('[data-block-id]') as HTMLElement | null;
      if (!block) {
        console.warn(`No block with data-block-id found for link ${index + 1}`);
        return;
      }
        
      hiddenBlocks.set(blockId, block.outerHTML);
      block.style.display = 'none';
      console.log(`Hidden block with data-block-id=${block.getAttribute('data-block-id')} and saved with key=${blockId} for link ${index + 1}`);
    }
  });

  // Второй проход для аннотаций
  links.forEach((link, index) => {
    if (processedLinks.has(link)) return;

    const href = link.getAttribute('href');
    if (!href) return;

    const parsedData = parseLinkAttributes(href);
    if (!parsedData || ('attributes' in parsedData && !parsedData.attributes)) return;

    processedLinks.add(link);

    if (!('attributes' in parsedData)) return;
    
    applyLinkStylesToText(link, parsedData, index);

    // Обработка аннотации-ссылки
    if (parsedData.attributes[0] === "1") {
      const blockId = parsedData.attributes[13];
      console.log(`Checking annotation for link ${index + 1}, blockId=${blockId}, hiddenBlocks keys=${Array.from(hiddenBlocks.keys())}`);
      if (blockId && hiddenBlocks.has(blockId)) {
        const parentBlock = link.closest('.notion-text-block') as HTMLElement | null;
        createTooltip(link, blockId, parentBlock, index, isDarkTheme);
      } else {
        console.warn(`No hidden block found for blockId=${blockId} or missing attributes[13] for link ${index + 1}`);
      }
    }
  });
}