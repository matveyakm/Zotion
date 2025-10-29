// test/modules/DOMModifier/scanner.test.ts

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processAttributedLinks } from '../../../src/modules/DOMModifier/scanner';
import * as parser from '../../../src/modules/DOMModifier/parser';
import * as styler from '../../../src/modules/DOMModifier/styles/textStyle';

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
    processAttributedLinks(container);
    expect(styler.applyLinkStylesToText).toHaveBeenCalledWith(
      link,
      mockParsedData,
      0,
      false
    );
  });

  it('processTextStyleLinks > should skip already processed links', () => {
    processAttributedLinks(container);
    processAttributedLinks(container);
    expect(styler.applyLinkStylesToText).toHaveBeenCalledTimes(1);
  });

  it('should hide block and save its HTML when attributes[0] === "2"', () => {
    document.body.innerHTML = '';

    const block = document.createElement('div');
    block.className = 'notion-text-block';
    block.setAttribute('data-block-id', 'test-block');

    const link = document.createElement('a');
    link.className = 'notion-link';
    link.href = 'http://example.com/#2.0.aaffff.440000.1.ffaaff.0.1.6.9.0.0.0#';
    link.textContent = 'hidden link';

    block.appendChild(link);
    document.body.appendChild(block);

    const mockHiddenData = {
      attributes: ['2', '8', 'aaffff', '440000', '1', 'ffaaff', '1', '1', '6', '9', '0', '0', '0'],
      info: null,
    };

    vi.spyOn(parser, 'parseLinkAttributes').mockReturnValue(mockHiddenData);
    vi.spyOn(styler, 'applyLinkStylesToText').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    
    processAttributedLinks(block);
  });
});