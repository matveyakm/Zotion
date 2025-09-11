import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processTextStyleLinks } from '../../../src/modules/textFormatting/scanner';
import * as parser from '../../../src/modules/textFormatting/parser';
import * as styler from '../../../src/modules/textFormatting/style';

describe('scanner.ts — Notion-like DOM case', () => {
  let container: HTMLElement;
  let link: HTMLAnchorElement;

  const mockParsedData = {
    attributes: ["0", "aaffff", "440000", "1", "ffaaff", "0", "1", "6", "9", "0", "0", "0"],
    info: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    container = document.createElement('div');
    container.className = 'notion-text-block';
    container.innerHTML = `
      <a class="notion-link" href="http://example.com/#0.0.aaffff.440000.1.ffaaff.0.1.6.9.0.0.0#">
        styled link
      </a>
    `;
    link = container.querySelector('a')!;
    document.body.appendChild(container);

    vi.spyOn(parser, 'parseLinkAttributes').mockReturnValue(mockParsedData);
    vi.spyOn(styler, 'applyLinkStylesToText').mockImplementation(() => {});
  });

  it('findStyledLinks > should find matching links for processing', () => {
    processTextStyleLinks(container);
    expect(styler.applyLinkStylesToText).toHaveBeenCalledWith(link, mockParsedData, expect.any(Number));
  });

  it('processTextStyleLinks > should skip already processed links', () => {
    processTextStyleLinks(container);
    processTextStyleLinks(container);
    expect(styler.applyLinkStylesToText).toHaveBeenCalledTimes(1);
  });

  it('processTextStyleLinks > should handle missing attributes gracefully', () => {
    vi.spyOn(parser, 'parseLinkAttributes').mockReturnValueOnce({attributes: null, info: null });
    processTextStyleLinks(container);
    expect(styler.applyLinkStylesToText).not.toHaveBeenCalled();
  });

  it('should hide block and save its HTML when attributes[0] === "2"', () => {
    // Настраиваем DOM
    const container = document.createElement('div');
    container.className = 'notion-text-block';
    container.setAttribute('data-block-id', 'test-block');
    
    const link = document.createElement('a');
    link.className = 'notion-link';
    link.href = 'http://example.com/#2.0.aaffff.440000.1.ffaaff.0.1.6.9.0.0.0#';
    link.textContent = 'styled link';
    
    container.appendChild(link);
    document.body.appendChild(container);
  
    // Мокаем parseLinkAttributes
    vi.spyOn(parser, 'parseLinkAttributes').mockReturnValue({
      attributes: ['2', '8', 'aaffff', '440000', '1', 'ffaaff', '1', '1', '6', '9', '0', '0', '0'],
    });
  
    // Мокаем applyLinkStylesToText и applyLinkStylesToInfoBlock
    vi.spyOn(styler, 'applyLinkStylesToText').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  
    // Выполняем функцию
    processTextStyleLinks(container);
  
    // Проверки
    const block = link.closest('[data-block-id]');
    expect(block).not.toBeNull();
    expect(block?.style.display).toBe('none');
    expect(block?.getAttribute('data-original-html')).toContain('styled link');
    expect(styler.applyLinkStylesToText).toHaveBeenCalled();;
  });
});