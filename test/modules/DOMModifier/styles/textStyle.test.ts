import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applyLinkStylesToText } from '../../../../src/modules/DOMModifier/styles/textStyle';
import { processedLinks } from '../../../../src/modules/DOMModifier/constants';
import { ParsedData } from '../../../../src/modules/DOMModifier/scanner';

describe('textStyle.ts — Link styling functions', () => {
  let link: HTMLAnchorElement;

  beforeEach(() => {
    // Очищаем DOM и моки
    document.body.innerHTML = '';
    vi.clearAllMocks();

    // Создаём тестовый элемент <a>
    link = document.createElement('a');
    link.className = 'notion-link notion-focusable-token notion-enable-hover';
    link.href = 'http://example.com/#0.0.aaffff.440000.1.ffaaff.0.1.6.9.0.0.0#';
    link.textContent = 'styled link';
    link.setAttribute('tabindex', '0');
    document.body.appendChild(link);

    // Мокаем processedLinks.add
    vi.spyOn(processedLinks, 'add').mockImplementation(() => {});
    // Мокаем console.log
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('applyLinkStylesToText', () => {
    it('применяет корректные стили к ссылке с валидными атрибутами', () => {
      const parsedData: ParsedData = {
        attributes: ['0', '8', 'aaffff', '440000', '1', 'ffaaff', '1', '1', '6', '9', '0', '0', '0'],
      };

      applyLinkStylesToText(link, parsedData, 0);

      // Проверяем базовые изменения
      expect(processedLinks.add).toHaveBeenCalledWith(link);
      expect(link.getAttribute('data-styled')).toBe('true');
      expect(link.style.textDecoration).toBe('underline'); // attributes[4] = '1' → decorations[1]
      expect(link.style.cursor).toBe('text');
      expect(link.style.pointerEvents).toBe('none');
      expect(link.hasAttribute('tabindex')).toBe(false);
      expect(link.classList.contains('notion-focusable-token')).toBe(false);
      expect(link.classList.contains('notion-enable-hover')).toBe(false);
      expect(link.style.position).toBe('relative');

      // Проверяем стили из атрибутов
      expect(link.style.fontSize).toBe('16px'); // attributes[1] = '8' → fontSizes[8]
      expect(link.style.color).toBe('rgb(170, 255, 255)'); // attributes[2] = 'aaffff'
      expect(link.style.fontStyle).toBe('italic'); // attributes[6] = '1'
      expect(link.style.fontWeight).toBe('bold'); // attributes[7] = '1'
      expect(link.style.letterSpacing).toBe('1px'); // attributes[8] = '6' → 6 - 5
      expect(link.style.wordSpacing).toBe('4px'); // attributes[9] = '9' → 9 - 5
      expect(link.style.whiteSpace).toBe('normal'); // attributes[10] = '0'

      // Проверяем логи
      expect(console.log).toHaveBeenCalledWith('Processing link 1');
      expect(console.log).toHaveBeenCalledWith('Applying styles for link 1 with attributes:', parsedData.attributes);
      expect(console.log).toHaveBeenCalledWith('Processed styled link 1 with styles applied');
    });

    it('применяет стили к вложенному span, если он есть', () => {
      const span = document.createElement('span');
      span.style.borderBottom = '1px solid black';
      span.style.opacity = '0.5';
      link.appendChild(span);

      const parsedData: ParsedData = {
        attributes: ['0', '8', 'aaffff', '440000', '1', 'ffaaff', '1', '1', '6', '9', '0', '0', '0'],
      };

      applyLinkStylesToText(link, parsedData, 0);

      expect(span.style.borderBottom).toBe('');
      expect(span.style.opacity).toBe('1');
    });

    it('не применяет стили, если attributes отсутствуют', () => {
      const parsedData: ParsedData = { attributes: null };

      applyLinkStylesToText(link, parsedData, 0);

      // Проверяем базовые изменения
      expect(processedLinks.add).toHaveBeenCalledWith(link);
      expect(link.getAttribute('data-styled')).toBe('true');
      expect(link.style.textDecoration).toBe('none');
      expect(link.style.cursor).toBe('text');
      expect(link.style.pointerEvents).toBe('none');
      expect(link.hasAttribute('tabindex')).toBe(false);
      expect(link.classList.contains('notion-focusable-token')).toBe(false);
      expect(link.classList.contains('notion-enable-hover')).toBe(false);
      expect(link.style.position).toBe('relative');

      // Проверяем, что стили атрибутов не применены
      expect(link.style.fontSize).toBe('');
      expect(link.style.color).toBe('');
      expect(link.style.backgroundColor).toBe('');
      expect(link.style.textDecorationColor).toBe('');
      expect(link.style.fontStyle).toBe('');
      expect(link.style.fontWeight).toBe('');
      expect(link.style.letterSpacing).toBe('');
      expect(link.style.wordSpacing).toBe('');
      expect(link.style.whiteSpace).toBe('');
      expect(link.style.direction).toBe('');
      expect(link.style.verticalAlign).toBe('');

      // Проверяем логи
      expect(console.log).toHaveBeenCalledWith('Processing link 1');
      // Лог 'Processed styled link...' не вызывается, так как функция завершается рано
    });

    it('применяет значения по умолчанию для некорректных атрибутов', () => {
      const parsedData: ParsedData = {
        attributes: ['0', 'ff', 'invalid-color', 'invalid-bg', '99', 'invalid-dec-color', '99', '99', 'invalid', 'invalid', '99', '99', '99'],
      };

      applyLinkStylesToText(link, parsedData, 0);

      // Проверяем стили с дефолтными значениями
      expect(link.style.fontSize).toBe('16px'); // fontSizes['ff'] → '16px'
      expect(link.style.color).toBe(''); // invalid-color
      expect(link.style.backgroundColor).toBe(''); // invalid-bg
      expect(link.style.textDecoration).toBe('none'); // decorations[99] → 'none'
      expect(link.style.textDecorationColor).toBe(''); // invalid-dec-color
      expect(link.style.fontStyle).toBe('normal'); // styles[99] → 'normal'
      expect(link.style.fontWeight).toBe('normal'); // weights[99] → 'normal'
      expect(link.style.letterSpacing).toBe(''); // parseInt('invalid') → NaN → не применяется
      expect(link.style.wordSpacing).toBe(''); // parseInt('invalid') → NaN → не применяется
      expect(link.style.whiteSpace).toBe('normal'); // spaces[99] → 'normal'

      // Проверяем логи
      expect(console.log).toHaveBeenCalledWith('Processing link 1');
      expect(console.log).toHaveBeenCalledWith('Applying styles for link 1 with attributes:', parsedData.attributes);
      expect(console.log).toHaveBeenCalledWith('Processed styled link 1 with styles applied');
    });
  });
});