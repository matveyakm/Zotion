// annotation.ts

import { log } from '../../../utils/log';

import { hiddenBlocks, annotationIDs } from '../constants';
import { createTooltip } from '../styles/annotationStyle';
import { ParsedData, indexOfTagID } from '../scanner';

const needToLog = true;

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
    log(`Block with blockId=${blockId} is already hidden for link ${index + 1}`, needToLog);
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
      log(`This block is already hidden for link ${index + 1}`, needToLog);
      return;
    }
  });

  hiddenBlocks.set(blockId, block.outerHTML);
  block.style.display = 'none';
  log(`Hidden block with data-block-id=${block.getAttribute('data-block-id')} and saved with key=${blockId} for link ${index + 1}`, needToLog);
}

export function createAnnotationTooltip(
  link: HTMLAnchorElement,
  parsedData: ParsedData,
  index: number,
  isDarkTheme: boolean
): void {
  if (!('attributes' in parsedData) || !parsedData.attributes) return;

  const blockId = parsedData.attributes[indexOfTagID];

  if (blockId) {
    annotationIDs.add(blockId);
  }

  log(`Checking annotation for link ${index + 1}, blockId=${blockId}, hiddenBlocks keys=${Array.from(hiddenBlocks.keys())}`, needToLog);
  if (blockId && hiddenBlocks.has(blockId)) {
    const parentBlock = link.closest('.notion-text-block') as HTMLElement | null;
    createTooltip(link, blockId, parentBlock, index, isDarkTheme);
  } else {
    console.warn(`No hidden block found for blockId=${blockId} or missing attributes[13] for link ${index + 1}`);
  }
}