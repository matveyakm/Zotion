import { describe, it, expect, beforeEach, vi } from 'vitest';
import { applyLinkStylesToText } from '../../../src/modules/textFormatting/style';
import { processedLinks } from '../../../src/modules/textFormatting/constants';

describe('style.ts — Link styling functions', () => {
  let link: HTMLAnchorElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    link = document.createElement('a');
    link.className = 'notion-link';
    link.href = 'http://example.com/#0.0.aaffff.440000.1.ffaaff.0.1.6.9.0.0.0#';
    link.textContent = 'styled link';
    document.body.appendChild(link);

    vi.spyOn(processedLinks, 'add').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('applyLinkStylesToText', () => {
    it('should apply text styles with valid attributes', () => {
      const parsedData = {
        attributes: ["0", "8", "aaffff", "440000", "1", "ffaaff", "1", "1", "6", "9", "0", "0", "0"],
      };

      applyLinkStylesToText(link, parsedData, 0);

      expect(processedLinks.add).toHaveBeenCalledWith(link);
      expect(link.getAttribute('data-styled')).toBe('true');
      expect(link.style.textDecoration).toBe('underline');
      expect(link.style.cursor).toBe('text');
      expect(link.style.pointerEvents).toBe('none');
      expect(link.hasAttribute('tabindex')).toBe(false);
      expect(link.classList.contains('notion-focusable-token')).toBe(false);
      expect(link.classList.contains('notion-enable-hover')).toBe(false);
      expect(link.style.fontSize).toBe('16px');
      expect(link.style.color).toBe('rgb(170, 255, 255)');
      expect(link.style.backgroundColor).toBe('rgb(68, 0, 0)');
      expect(link.style.textDecorationColor).toBe('#ffaaff'); // Исправлено: HEX вместо RGB
      expect(link.style.fontStyle).toBe('italic');
      expect(link.style.fontWeight).toBe('bold');
      expect(link.style.letterSpacing).toBe('1px');
      expect(link.style.wordSpacing).toBe('4px');
    });

    it('should apply legacy color if provided', () => {
      const parsedData = { legacyColor: 'ff0000' };

      applyLinkStylesToText(link, parsedData, 0);

      expect(link.style.color).toBe('rgb(255, 0, 0)');
      expect(processedLinks.add).toHaveBeenCalledWith(link);
      expect(link.getAttribute('data-styled')).toBe('true');
    });

    it('should not apply styles if attributes are missing', () => {
      const parsedData = { attributes: null };

      applyLinkStylesToText(link, parsedData, 0);

      expect(processedLinks.add).toHaveBeenCalledWith(link);
      expect(link.getAttribute('data-styled')).toBe('true');
      expect(link.style.color).toBe('');
      expect(link.style.fontSize).toBe('');
    });
  });
});