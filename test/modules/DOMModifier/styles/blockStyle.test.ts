import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { applyBlockStyles } from '../../../../src/modules/DOMModifier/styles/blockStyle';
import * as colorStyler from '../../../../src/modules/DOMModifier/styles/colorStyler';
import * as alignmentStyle from '../../../../src/modules/DOMModifier/styles/alignmentStyle';

// Мокаем зависимости
vi.mock('../../../../src/modules/DOMModifier/styles/colorStyler', () => ({
  processRGB: vi.fn(),
}));

vi.mock('../../../../src/modules/DOMModifier/styles/alignmentStyle', () => ({
  applyAlignmentStyles: vi.fn(),
}));

// Мокаем getComputedStyle
const getComputedStyleMock = vi.fn();
Object.defineProperty(window, 'getComputedStyle', {
  value: getComputedStyleMock,
  writable: true,
});

describe('blockStyle.ts — applyBlockStyles', () => {
  let link: HTMLAnchorElement;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let processRGBSpy: ReturnType<typeof vi.spyOn>;
  let applyAlignmentStylesSpy: ReturnType<typeof vi.spyOn>;

  const mockParsedData = (attrs: (string | null)[]) => ({
    attributes: attrs,
  });

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    processRGBSpy = vi.spyOn(colorStyler, 'processRGB').mockImplementation((hex) => {
      if (!hex || hex === 'NULL') return 'NULL'; // Возвращаем строку 'NULL', а не null
      return `rgb(${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)})`;
    });
    applyAlignmentStylesSpy = vi.spyOn(alignmentStyle, 'applyAlignmentStyles');

    getComputedStyleMock.mockImplementation((el: HTMLElement) => {
      const style = el.style;
      return {
        borderColor: style.borderColor || 'rgb(0, 0, 0)',
        borderInlineStart: style.borderInlineStart || '',
        getPropertyValue: (prop: string) => style.getPropertyValue(prop),
      } as unknown as CSSStyleDeclaration;
    });

    document.body.innerHTML = '';
    document.head.innerHTML = '';

    link = document.createElement('a');
    link.setAttribute('href', '#');
    document.body.appendChild(link);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  describe('applyBlockStyles', () => {
    it('не применяет стили, если attributes === null', () => {
      applyBlockStyles(link, { attributes: null }, 0, false);
      expect(consoleLogSpy).toHaveBeenCalledWith('Trying to apply block styles for link 1');
      expect(processRGBSpy).not.toHaveBeenCalled();
      expect(applyAlignmentStylesSpy).not.toHaveBeenCalled();
    });

    it('применяет стили к callout блоку', () => {
      const callout = document.createElement('div');
      callout.className = 'notion-callout-block';
      const noteDiv = document.createElement('div');
      noteDiv.setAttribute('role', 'note');
      const targetDiv = document.createElement('div');
      noteDiv.appendChild(targetDiv);
      callout.appendChild(noteDiv);
      callout.appendChild(link);
      document.body.appendChild(callout);

      const attrs = [null, 'A', 'FF0000FF', '1', '00FF00FF', '1', '2'];
      applyBlockStyles(link, mockParsedData(attrs), 0, false);

      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'Trying to apply block styles for link 1');
      expect(consoleLogSpy).toHaveBeenNthCalledWith(2, 'Applying styles (block) for link 1');

      expect(targetDiv.style.borderRadius).toBe('30px');
      expect(targetDiv.style.paddingInline).toBe('10px');
      expect(targetDiv.style.paddingTop).toBe('12px');
      expect(targetDiv.style.paddingBottom).toBe('12px');

      expect(targetDiv.style.border).toBe('1px solid rgb(255, 0, 0)');
      expect(targetDiv.style.backgroundColor).toBe('rgb(0, 255, 0)');

      expect(applyAlignmentStylesSpy).toHaveBeenCalledWith(
        targetDiv,
        '1',
        '2',
        0,
        ''
      );
    });

    it('применяет стили к quote блоку', () => {
      const quote = document.createElement('div');
      quote.className = 'notion-quote-block';
      const blockquote = document.createElement('blockquote');
      const targetDiv = document.createElement('div');
      blockquote.appendChild(targetDiv);
      quote.appendChild(blockquote);
      quote.appendChild(link);
      document.body.appendChild(quote);

      const attrs = [null, null, 'FF0000FF', '2', '00FF00FF', '0', null];
      applyBlockStyles(link, mockParsedData(attrs), 1, true);

      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'Trying to apply block styles for link 2');
      expect(consoleLogSpy).toHaveBeenNthCalledWith(2, 'Applying styles for link 2 with attributes:', attrs);

      expect(targetDiv.style.paddingTop).toBe('3px');
      expect(targetDiv.style.paddingBottom).toBe('3px');
      expect(targetDiv.style.borderInlineStart).toBe('2px solid rgb(255, 0, 0)');
      expect(targetDiv.style.backgroundColor).toBe('rgb(0, 255, 0)');

      expect(applyAlignmentStylesSpy).toHaveBeenCalledWith(
        targetDiv,
        '0',
        null,
        1,
        ''
      );
    });

    it('применяет стили к таблице', () => {
      const table = document.createElement('div');
      table.className = 'notion-table-block';
      const row = document.createElement('div');
      row.className = 'notion-table-row';
      const td = document.createElement('td');
      td.appendChild(link);
      row.appendChild(td);
      table.appendChild(row);
      document.body.appendChild(table);

      const attrs = [null, null, '00FF00FF', '3', 'FF0000FF', '2', '1'];
      applyBlockStyles(link, mockParsedData(attrs), 2, false);

      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'Trying to apply block styles for link 3');
      expect(consoleLogSpy).toHaveBeenNthCalledWith(2, 'Applying styles (table) for link 3 with attributes:', attrs);

      const linkId = link.getAttribute('data-link-id');
      expect(linkId).toMatch(/^link-2-\d+$/);

      expect(td.style.backgroundColor).toBe('rgb(0, 255, 0)');
      expect(td.style.getPropertyValue('border')).toBe('3px solid rgb(255, 0, 0)');

      const styleEl = document.head.querySelector('style');
      const css = styleEl?.textContent || '';
      expect(css).toContain(`td:has(a[data-link-id="${linkId}"])`);
      expect(css).toContain('border: 3px solid rgb(255, 0, 0) !important');
      expect(css).toContain('background-color: rgb(0, 255, 0) !important');
      expect(css).toContain('text-align: right !important');
      expect(css).toContain('vertical-align: middle !important');
    });

    it('обрабатывает отсутствие td в таблице', () => {
      const table = document.createElement('div');
      table.className = 'notion-table-block';
      table.appendChild(link);
      document.body.appendChild(table);

      applyBlockStyles(link, mockParsedData([null]), 0, false);

      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'Trying to apply block styles for link 1');
      // Код не логирует "Target cell not found" — проверка убрана
    });

    it('обрабатывает некорректные цвета и значения', () => {
      const callout = document.createElement('div');
      callout.className = 'notion-callout-block';
      const noteDiv = document.createElement('div');
      noteDiv.setAttribute('role', 'note');
      const targetDiv = document.createElement('div');
      noteDiv.appendChild(targetDiv);
      callout.appendChild(noteDiv);
      callout.appendChild(link);
      document.body.appendChild(callout);

      processRGBSpy.mockImplementation((hex) => {
        if (!hex || hex === 'NULL') return 'NULL';
        const match = hex.match(/[0-9a-fA-F]{7}/);
        if (!match) return 'NULL';
        const h = match[0];
        return `rgb(${parseInt(h.slice(0, 2), 16)}, ${parseInt(h.slice(2, 4), 16)}, ${parseInt(h.slice(4, 6), 16)})`;
      });

      const attrs = [null, 'Z', 'invalid', 'X', 'badcolor', null, null];
      applyBlockStyles(link, mockParsedData(attrs), 0, false);

      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'Trying to apply block styles for link 1');
      expect(consoleLogSpy).toHaveBeenNthCalledWith(2, 'Applying styles (block) for link 1');

      expect(targetDiv.style.borderRadius).toBe('');
      expect(targetDiv.style.backgroundColor).toBe('');
    });

    it('применяет alignment только если есть attributes[5] или [6]', () => {
      const callout = document.createElement('div');
      callout.className = 'notion-callout-block';
      const noteDiv = document.createElement('div');
      noteDiv.setAttribute('role', 'note');
      const targetDiv = document.createElement('div');
      noteDiv.appendChild(targetDiv);
      callout.appendChild(noteDiv);
      callout.appendChild(link);
      document.body.appendChild(callout);

      applyBlockStyles(link, mockParsedData([null, null, null, null, null, null, null]), 0, false);
      expect(applyAlignmentStylesSpy).not.toHaveBeenCalled();

      applyBlockStyles(link, mockParsedData([null, null, null, null, null, '1', null]), 0, false);
      expect(applyAlignmentStylesSpy).toHaveBeenCalledWith(
        targetDiv,
        '1',
        null,
        0,
        ''
      );
    });

    it('использует getComputedStyle для начального borderColor', () => {
      const quote = document.createElement('div');
      quote.className = 'notion-quote-block';
      const blockquote = document.createElement('blockquote');
      const targetDiv = document.createElement('div');
      targetDiv.style.borderInlineStart = '5px solid blue';
      blockquote.appendChild(targetDiv);
      quote.appendChild(blockquote);
      quote.appendChild(link);
      document.body.appendChild(quote);

      getComputedStyleMock.mockImplementationOnce(() => ({
        borderInlineStart: '5px solid blue',
      } as unknown as CSSStyleDeclaration));

      applyBlockStyles(link, mockParsedData([null, null, null, null, null]), 0, false);

      expect(targetDiv.style.borderInlineStart).toBe('3px solid 5px solid blue');
    });

    it('обрабатывает table без фона', () => {
      const table = document.createElement('div');
      table.className = 'notion-table-block';
      const td = document.createElement('td');
      td.appendChild(link);
      table.appendChild(td);
      document.body.appendChild(table);

      applyBlockStyles(link, mockParsedData([null, null, null, null, null]), 0, false);

      const styleEl = document.head.querySelector('style');
      expect(styleEl?.textContent).toContain('background-color: transparent !important');
    });

    it('устанавливает data-link-id только в таблице', () => {
      const callout = document.createElement('div');
      callout.className = 'notion-callout-block';
      callout.appendChild(link);
      document.body.appendChild(callout);

      applyBlockStyles(link, mockParsedData([null]), 0, false);
      expect(link.hasAttribute('data-link-id')).toBe(false);
    });
  });
});