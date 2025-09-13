import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applyTooltipStyles, createTooltip } from '../../../../src/modules/DOMModifier/styles/annotationStyle';
import * as tooltipModule from '../../../../src/modules/DOMModifier/annotation/tooltip';
import * as constants from '../../../../src/modules/DOMModifier/constants';

// Мокаем addTooltipListeners
vi.mock('../../../../src/modules/DOMModifier/annotation/tooltip', () => ({
    addTooltipListeners: vi.fn(),
}));

// Мокаем hiddenBlocks
vi.mock('../../constants', () => ({
    hiddenBlocks: new Map<string, string>(),
}));

describe('annotationStyle', () => {
  let link: HTMLAnchorElement;
  let parentBlock: HTMLElement;
  let tooltip: HTMLDivElement;
  let closeButton: HTMLSpanElement;

  beforeEach(() => {
    // Очищаем DOM и моки перед каждым тестом
    document.body.innerHTML = '';
    vi.clearAllMocks();

    // Создаём тестовые элементы
    link = document.createElement('a');
    parentBlock = document.createElement('div');
    parentBlock.className = 'notion-text-block';
    tooltip = document.createElement('div');
    closeButton = document.createElement('span');

    // Мокаем getBoundingClientRect для parentBlock
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
    });

    // Мокаем document.body.classList.contains
    vi.spyOn(document.body.classList, 'contains').mockReturnValue(false); // Светлая тема по умолчанию
    vi.spyOn(document, 'querySelector').mockReturnValue(null); // Нет .notion-dark-theme
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('applyTooltipStyles', () => {
    it('применяет корректные стили к тултипу и кнопке закрытия для светлой темы на десктопе', () => {
      window.innerWidth = 1024; // Десктоп
      applyTooltipStyles(tooltip, parentBlock, false, closeButton);

      // Проверяем стили тултипа
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

      // Проверяем стили кнопки закрытия
      expect(closeButton.style.position).toBe('absolute');
      expect(closeButton.style.top).toBe('2px');
      expect(closeButton.style.right).toBe('2px');
      expect(closeButton.style.fontSize).toBe('12px');
      expect(closeButton.style.fontWeight).toBe('bold');
      expect(closeButton.style.color).toBe('rgb(34, 34, 34)');
      expect(closeButton.style.cursor).toBe('pointer');
      expect(closeButton.style.padding).toBe('2px 4px');
      expect(closeButton.style.lineHeight).toBe('1');

      // Проверяем логи
      expect(console.log).toHaveBeenCalledWith('Tooltip theme: ', 'Light');
      expect(console.log).toHaveBeenCalledWith('Tooltip device type: ', 'Desktop');
    });

    it('применяет корректные стили к тултипу и кнопке закрытия для тёмной темы на мобильном устройстве', () => {
      window.innerWidth = 500; // Мобильное устройство
      vi.spyOn(document.body.classList, 'contains').mockReturnValue(true); // Тёмная тема

      applyTooltipStyles(tooltip, parentBlock, true, closeButton);

      // Проверяем стили тултипа
      expect(tooltip.style.backgroundColor).toBe('rgba(33, 33, 33, 0.95)');
      expect(tooltip.style.border).toBe('1px solid rgb(74, 74, 74)');
      expect(tooltip.style.padding).toBe('8px');
      expect(tooltip.style.maxWidth).toBe('400px');
      expect(tooltip.style.minWidth).toBe('80px');
      expect(tooltip.style.boxShadow).toBe('0 4px 12px rgba(0, 0, 0, 0.4)');
      expect(tooltip.style.color).toBe('rgb(255, 255, 255)');
      expect(tooltip.style.fontSize).toBe('12px');
      expect(tooltip.style.maxHeight).toBe('200px');

      // Проверяем стили кнопки закрытия
      expect(closeButton.style.color).toBe('rgb(164, 164, 164)');

      // Проверяем логи
      expect(console.log).toHaveBeenCalledWith('Tooltip theme: ', 'Dark');
      expect(console.log).toHaveBeenCalledWith('Tooltip device type: ', 'Mobile');
    });

    it('использует ширину 600px, если parentBlock равен null', () => {
      applyTooltipStyles(tooltip, null, false, closeButton);
      expect(tooltip.style.maxWidth).toBe('400px');
    });
  });

  describe('createTooltip', () => {
    it('создаёт тултип с кнопкой закрытия, применяет стили и добавляет слушатели', () => {
      // Настраиваем mock для hiddenBlocks
      vi.spyOn(constants.hiddenBlocks, 'get').mockReturnValue('<p>Test content</p>');

      // Создаём тестовые элементы
      link.setAttribute('href', '#test-block');
      const blockId = 'test-block';
      const index = 1;
      const isDarkTheme = false;

      createTooltip(link, blockId, parentBlock, index, isDarkTheme);

      // Проверяем создание тултипа
      const tooltip = document.body.querySelector('.annotation-tooltip') as HTMLDivElement;
      expect(tooltip).not.toBeNull();
      expect(tooltip.className).toBe('annotation-tooltip');
      expect(tooltip.innerHTML).toContain('<p>Test content</p>');

      // Проверяем кнопку закрытия
      const closeButton = tooltip.querySelector('span') as HTMLSpanElement;
      expect(closeButton).not.toBeNull();
      expect(closeButton.innerHTML).toBe('×');

      // Проверяем вызов applyTooltipStyles
      expect(tooltip.style.position).toBe('absolute');
      expect(closeButton.style.position).toBe('absolute');

      // Проверяем добавление тултипа в DOM
      expect(document.body.contains(tooltip)).toBe(true);

      // Проверяем установку pointerEvents
      expect(link.style.pointerEvents).toBe('auto');

      // Проверяем вызов addTooltipListeners
      expect(tooltipModule.addTooltipListeners).toHaveBeenCalledWith(link, tooltip, index);

      // Проверяем обработчик клика по кнопке закрытия
      const clickEvent = new Event('click', { bubbles: true });
      vi.spyOn(clickEvent, 'stopPropagation');
      closeButton.dispatchEvent(clickEvent);
      expect(tooltip.style.display).toBe('none');
      expect(tooltip.style.opacity).toBe('0');
      expect(console.log).toHaveBeenCalledWith(`Tooltip closed via X button for link ${index + 1}`);
      expect(clickEvent.stopPropagation).toHaveBeenCalled();

      // Проверяем логи
      expect(console.log).toHaveBeenCalledWith(`Adding tooltip listeners for link ${index + 1}, link element:`, link);
    });

    it('обрабатывает случай, когда hiddenBlocks возвращает пустую строку', () => {
      vi.spyOn(constants.hiddenBlocks, 'get').mockReturnValue('');

      createTooltip(link, 'empty-block', parentBlock, 1, false);

      const tooltip = document.body.querySelector('.annotation-tooltip') as HTMLDivElement;
      expect(tooltip.innerHTML).toBe('<span style="position: absolute; top: 2px; right: 2px; font-size: 12px; font-weight: bold; color: rgb(34, 34, 34); cursor: pointer; padding: 2px 4px; line-height: 1;">×</span>');
      expect(document.body.contains(tooltip)).toBe(true);
    });
  });
});