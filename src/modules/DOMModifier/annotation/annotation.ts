import { hiddenBlocks } from '../constants';
import { createTooltip } from '../styles/annotationStyle';
import { ParsedData, indexOfTagID } from '../scanner';

export function hideAnnotationBlock(link: HTMLAnchorElement, parsedData: ParsedData, index: number): void {
  if (!('attributes' in parsedData) || !parsedData.attributes) return;

  if (!parsedData.attributes[indexOfTagID]) {
    console.warn(`Format of attributes is not correct for link ${index + 1}`);
    return;
  }

  const blockId = parsedData.attributes[indexOfTagID];
  if (!blockId) {
    console.warn(`Cant found blockID for link ${index + 1}`);
    return;
  }
  
  // Запрет на повторное скрытие блока по одному и тому же blockId
  if (hiddenBlocks.has(blockId)) {
    console.log(`Block with blockId=${blockId} is already hidden for link ${index + 1}`);
    return;
  }

  const block = link.closest('[data-block-id]') as HTMLElement | null;
  if (!block) {
    console.warn(`No block with data-block-id found for link ${index + 1}`);
    return;
  }

  // Запрет на повторное скрытие одного и того же блока
  hiddenBlocks.forEach(element => {
    if (String(block) == hiddenBlocks.get(element)) {
      console.log(`This block is already hidden for link ${index + 1}`);
      return;
    }
  });

  hiddenBlocks.set(blockId, block.outerHTML);
  block.style.display = 'none';
  console.log(`Hidden block with data-block-id=${block.getAttribute('data-block-id')} and saved with key=${blockId} for link ${index + 1}`);
}

export function createAnnotationTooltip(
  link: HTMLAnchorElement,
  parsedData: ParsedData,
  index: number,
  isDarkTheme: boolean
): void {
  if (!('attributes' in parsedData) || !parsedData.attributes) return;

  const blockId = parsedData.attributes[indexOfTagID];
  console.log(`Checking annotation for link ${index + 1}, blockId=${blockId}, hiddenBlocks keys=${Array.from(hiddenBlocks.keys())}`);
  if (blockId && hiddenBlocks.has(blockId)) {
    const parentBlock = link.closest('.notion-text-block') as HTMLElement | null;
    createTooltip(link, blockId, parentBlock, index, isDarkTheme);
  } else {
    console.warn(`No hidden block found for blockId=${blockId} or missing attributes[13] for link ${index + 1}`);
  }
}