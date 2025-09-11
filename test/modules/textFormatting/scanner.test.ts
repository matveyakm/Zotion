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
});