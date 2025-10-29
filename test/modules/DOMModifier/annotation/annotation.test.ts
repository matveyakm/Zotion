import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { hideAnnotationBlock, createAnnotationTooltip } from '../../../../src/modules/DOMModifier/annotation/annotation';
import { hiddenBlocks } from '../../../../src/modules/DOMModifier/constants';
import { indexOfTagID } from '../../../../src/modules/DOMModifier/scanner';
import { ParsedData } from '../../../../src/modules/DOMModifier/scanner';


vi.mock('../../../../src/modules/DOMModifier/styles/annotationStyle', () => ({
  createTooltip: vi.fn(),
  applyTooltipStyles:-vi.fn(),
}));


import * as annotationStyle from '../../../../src/modules/DOMModifier/styles/annotationStyle';

describe('annotation.ts', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    hiddenBlocks.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks(); 
    hiddenBlocks.clear();
  });

  const setupDOM = (blockId: string, withNotionBlock = false) => {
    const block = document.createElement('div');
    block.setAttribute('data-block-id', blockId);

    const link = document.createElement('a');
    link.href = '#';
    block.appendChild(link);

    if (withNotionBlock) {
      const notionBlock = document.createElement('div');
      notionBlock.classList.add('notion-text-block');
      notionBlock.appendChild(block);
      document.body.appendChild(notionBlock);
      return { link, block, notionBlock };
    }

    document.body.appendChild(block);
    return { link, block };
  };

  const createParsedData = (blockId?: string): ParsedData => {
    const attributes = new Array(14).fill('');
    if (blockId !== undefined) {
      attributes[indexOfTagID] = blockId;
    }
    return { attributes } as ParsedData;
  };

  describe('hideAnnotationBlock', () => {
    it('should return early if no attributes in parsedData', () => {
      const { link } = setupDOM('test-id');
      const parsedData = {} as ParsedData;

      hideAnnotationBlock(link, parsedData, 0);

      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(hiddenBlocks.size).toBe(0);
    });

    it('should warn and return if no attributes[indexOfTagID]', () => {
      const { link } = setupDOM('test-id');
      const parsedData = { attributes: [] } as ParsedData;

      hideAnnotationBlock(link, parsedData, 0);

      expect(consoleWarnSpy).toHaveBeenCalledWith('Format of attributes is not correct for link 1');
      expect(hiddenBlocks.size).toBe(0);
    });

    it('should warn and return if blockId is empty', () => {
      const { link } = setupDOM('test-id');
      const attributes = new Array(14).fill('');
      attributes[indexOfTagID] = ''; 
      const parsedData = { attributes } as ParsedData;
    
      hideAnnotationBlock(link, parsedData, 0);

      
      expect(hiddenBlocks.size).toBe(0);
    });

    it('should log and return if blockId already in hiddenBlocks', () => {
      const blockId = 'test-id';
      const { link } = setupDOM(blockId);
      const parsedData = createParsedData(blockId);

      hideAnnotationBlock(link, parsedData, 0);
      vi.clearAllMocks(); 

      hideAnnotationBlock(link, parsedData, 0);

      expect(consoleLogSpy).toHaveBeenCalledWith(`Block with blockId=${blockId} is already hidden for link 1`);
      expect(hiddenBlocks.size).toBe(1);
    });

    it('should warn and return if no block with [data-block-id] found', () => {
      const link = document.createElement('a');
      document.body.appendChild(link);
      const parsedData = createParsedData('test-id');

      hideAnnotationBlock(link, parsedData, 0);

      expect(consoleWarnSpy).toHaveBeenCalledWith('No block with data-block-id found for link 1');
      expect(hiddenBlocks.size).toBe(0);
    });

    it('should log and return if block outerHTML already hidden', () => {
      const blockId = 'test-id';
      const { link, block } = setupDOM(blockId);
      const parsedData = createParsedData(blockId);
    
      hideAnnotationBlock(link, parsedData, 0);
      vi.clearAllMocks();
    
      hideAnnotationBlock(link, parsedData, 0);
    
      expect(consoleLogSpy).toHaveBeenCalledWith(`Block with blockId=${blockId} is already hidden for link 1`);
      expect(block.style.display).toBe('none');
      expect(hiddenBlocks.size).toBe(1);
    });

    it('should hide block and save to hiddenBlocks on happy path', () => {
      const blockId = 'test-id';
      const { link, block } = setupDOM(blockId);
      const parsedData = createParsedData(blockId);
    
      hideAnnotationBlock(link, parsedData, 0);
    
      expect(block.style.display).toBe('none');
      expect(hiddenBlocks.has(blockId)).toBe(true);
      const savedHTML = hiddenBlocks.get(blockId);
      expect(savedHTML).toContain('data-block-id="test-id"');
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `Hidden block with data-block-id=${blockId} and saved with key=${blockId} for link 1`
      );
    });
  });

  describe('createAnnotationTooltip', () => {
    it('should return early if no attributes in parsedData', () => {
      const { link } = setupDOM('test-id', true);
      const parsedData = {} as ParsedData;

      createAnnotationTooltip(link, parsedData, 0, false);

      expect(annotationStyle.createTooltip).not.toHaveBeenCalled();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should warn if no blockId or not in hiddenBlocks', () => {
      const { link } = setupDOM('test-id', true);
      const parsedData = createParsedData('test-id');

      createAnnotationTooltip(link, parsedData, 0, false);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'No hidden block found for blockId=test-id or missing attributes[13] for link 1'
      );
      expect(annotationStyle.createTooltip).not.toHaveBeenCalled();
    });

    it('should create tooltip if blockId in hiddenBlocks', () => {
      const blockId = 'test-id';
      const { link, block, notionBlock } = setupDOM(blockId, true) as {
        link: HTMLAnchorElement;
        block: HTMLElement;
        notionBlock: HTMLElement;
      };
      const parsedData = createParsedData(blockId);

      block.style.display = 'none';
      hiddenBlocks.set(blockId, block.outerHTML);

      createAnnotationTooltip(link, parsedData, 0, true);

      expect(annotationStyle.createTooltip).toHaveBeenCalledWith(
        link,
        blockId,
        notionBlock,
        0,
        true
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `Checking annotation for link 1, blockId=${blockId}, hiddenBlocks keys=${blockId}`
      );
    });
  });
});