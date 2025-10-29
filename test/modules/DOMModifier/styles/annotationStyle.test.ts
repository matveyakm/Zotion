import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applyTooltipStyles, createTooltip } from '../../../../src/modules/DOMModifier/styles/annotationStyle';
import * as tooltipModule from '../../../../src/modules/DOMModifier/annotation/tooltip';
import * as constants from '../../../../src/modules/DOMModifier/constants';

// Мокаем addTooltipListeners
vi.mock('../../../../src/modules/DOMModifier/annotation/tooltip', () => ({
    addTooltipListeners: vi.fn(),
}));

// Мокаем hiddenBlocks
vi.mock('../../../../src/modules/DOMModifier/constants', () => ({
    hiddenBlocks: new Map<string, string>(),
}));

describe('annotationStyle', () => {
  let link: HTMLAnchorElement;
  let parentBlock: HTMLElement;
  let tooltip: HTMLDivElement;
  let closeButton: HTMLSpanElement;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();

    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    link = document.createElement('a');
    parentBlock = document.createElement('div');
    parentBlock.className = 'notion-text-block';
    tooltip = document.createElement('div');
    closeButton = document.createElement('span');

    vi.spyOn(parentBlock, 'getBoundingClientRect').mockReturnValue({
      width: 600,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    vi.spyOn(document.body.classList, 'contains').mockReturnValue(false);
    vi.spyOn(document, 'querySelector').mockReturnValue(null);
  });

  describe('applyTooltipStyles', () => {
    it('применяет корректные стили к тултипу и кнопке закрытия для светлой темы на десктопе', () => {
      window.innerWidth = 1024;
      applyTooltipStyles(tooltip, parentBlock, false, closeButton);

      expect(tooltip.style.position).toBe('absolute');
      expect(tooltip.style.display).toBe('none');
      expect(tooltip.style.backgroundColor).toBe('rgba(245, 245, 245, 0.95)');
      expect(tooltip.style.border).toBe('1px solid rgb(211, 211, 211)');
      expect(tooltip.style.padding).toBe('12px');
      expect(tooltip.style.zIndex).toBe('10000');
      expect(tooltip.style.maxWidth).toBe('600px');
      expect(tooltip.style.minWidth).toBe('100px');
      expect(tooltip.style.borderRadius).toBe('6px');
      expect(tooltip.style.boxShadow).toBe('0 4px 12px rgba(0, 0, 0, 0.2)');
      expect(tooltip.style.color).toBe('rgb(0, 0, 0)');
      expect(tooltip.style.fontFamily).toBe('ui-sans-serif, system-ui, sans-serif');
      expect(tooltip.style.fontSize).toBe('14px');
      expect(tooltip.style.lineHeight).toBe('1.5');
      expect(tooltip.style.transition).toBe('opacity 0.2s ease-in-out');
      expect(tooltip.style.opacity).toBe('0');
      expect(tooltip.style.whiteSpace).toBe('normal');
      expect(tooltip.style.height).toBe('auto');
      expect(tooltip.style.maxHeight).toBe('500px');
      expect(tooltip.style.overflowY).toBe('auto');

      expect(closeButton.style.position).toBe('absolute');
      expect(closeButton.style.top).toBe('2px');
      expect(closeButton.style.right).toBe('2px');
      expect(closeButton.style.fontSize).toBe('12px');
      expect(closeButton.style.fontWeight).toBe('bold');
      expect(closeButton.style.color).toBe('rgb(34, 34, 34)');
      expect(closeButton.style.cursor).toBe('pointer');
      expect(closeButton.style.padding).toBe('2px 4px');
      expect(closeButton.style.lineHeight).toBe('1');

      // В реальности вызывается ТОЛЬКО лог устройства
      expect(consoleLogSpy).toHaveBeenCalledWith('Tooltip device type: ', 'Desktop');
      expect(consoleLogSpy).not.toHaveBeenCalledWith('Tooltip theme: ', 'Light');
    });

    it('применяет корректные стили к тултипу и кнопке закрытия для тёмной темы на мобильном устройстве', () => {
      window.innerWidth = 500;
      vi.spyOn(document.body.classList, 'contains').mockReturnValue(true);

      applyTooltipStyles(tooltip, parentBlock, true, closeButton);

      expect(tooltip.style.backgroundColor).toBe('rgba(33, 33, 33, 0.95)');
      expect(tooltip.style.border).toBe('1px solid rgb(74, 74, 74)');
      expect(tooltip.style.padding).toBe('8px');
      expect(tooltip.style.maxWidth).toBe('400px');
      expect(tooltip.style.minWidth).toBe('80px');
      expect(tooltip.style.boxShadow).toBe('0 4px 12px rgba(0, 0, 0, 0.4)');
      expect(tooltip.style.color).toBe('rgb(255, 255, 255)');
      expect(tooltip.style.fontSize).toBe('12px');
      expect(tooltip.style.maxHeight).toBe('200px');

      expect(closeButton.style.color).toBe('rgb(164, 164, 164)');

      expect(consoleLogSpy).toHaveBeenCalledWith('Tooltip device type: ', 'Mobile');
      expect(consoleLogSpy).not.toHaveBeenCalledWith('Tooltip theme: ', 'Dark');
    });

    it('использует ширину 400px, если parentBlock равен null (мобильное по умолчанию)', () => {
      applyTooltipStyles(tooltip, null, false, closeButton);
      expect(tooltip.style.maxWidth).toBe('400px');
    });
  });

  describe('createTooltip', () => {
    it('создаёт тултип с кнопкой закрытия, применяет стили и добавляет слушатели', () => {
      vi.spyOn(constants.hiddenBlocks, 'get').mockReturnValue('<p>Test content</p>');

      link.setAttribute('href', '#test-block');
      const blockId = 'test-block';
      const index = 1;
      const isDarkTheme = false;

      createTooltip(link, blockId, parentBlock, index, isDarkTheme);

      const createdTooltip = document.body.querySelector('.annotation-tooltip') as HTMLDivElement;
      expect(createdTooltip).not.toBeNull();
      expect(createdTooltip.className).toBe('annotation-tooltip');
      expect(createdTooltip.innerHTML).toContain('<p>Test content</p>');

      const createdCloseButton = createdTooltip.querySelector('span') as HTMLSpanElement;
      expect(createdCloseButton).not.toBeNull();
      expect(createdCloseButton.innerHTML).toBe('×');

      expect(createdTooltip.style.position).toBe('absolute');
      expect(createdCloseButton.style.position).toBe('absolute');
      expect(document.body.contains(createdTooltip)).toBe(true);
      expect(link.style.pointerEvents).toBe('auto');

      expect(tooltipModule.addTooltipListeners).toHaveBeenCalledWith(link, createdTooltip, index);

      const clickEvent = new Event('click', { bubbles: true });
      const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');
      createdCloseButton.dispatchEvent(clickEvent);
      expect(createdTooltip.style.display).toBe('none');
      expect(createdTooltip.style.opacity).toBe('0');
      expect(consoleLogSpy).toHaveBeenCalledWith(`Tooltip closed via X button for link ${index + 1}`);
      expect(stopPropagationSpy).toHaveBeenCalled();

      expect(consoleLogSpy).toHaveBeenCalledWith(`Adding tooltip listeners for link ${index + 1}, link element:`, link);
    });

    it('обрабатывает случай, когда hiddenBlocks возвращает пустую строку', () => {
      vi.spyOn(constants.hiddenBlocks, 'get').mockReturnValue('');

      createTooltip(link, 'empty-block', parentBlock, 1, false);

      const createdTooltip = document.body.querySelector('.annotation-tooltip') as HTMLDivElement;
      expect(createdTooltip.innerHTML).toBe('<span style="position: absolute; top: 2px; right: 2px; font-size: 12px; font-weight: bold; color: rgb(34, 34, 34); cursor: pointer; padding: 2px 4px; line-height: 1;">×</span>');
      expect(document.body.contains(createdTooltip)).toBe(true);
    });
  });
});