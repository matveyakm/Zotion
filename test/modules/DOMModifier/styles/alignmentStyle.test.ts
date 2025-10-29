import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { applyAlignmentStyles } from '../../../../src/modules/DOMModifier/styles/alignmentStyle';

describe('alignmentStyle.ts — applyAlignmentStyles', () => {
  let element: HTMLElement;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  const index = 0;
  const linkId = 'link-123';

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    element = document.createElement('div');
    element.setAttribute('data-link-id', linkId);
    document.body.appendChild(element);

    document.head.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  it('should apply default alignment (left/top) when textAlign/verticalAlign are null', () => {
    applyAlignmentStyles(element, null, null, index, linkId);

    // Inline-стили НЕ применяются, если textAlign/verticalAlign === null
    expect(element.style.textAlign).toBe('');
    expect(element.style.verticalAlign).toBe('');

    const styleEl = document.head.querySelector('style');
    const css = styleEl?.textContent || '';

    expect(css).toContain('text-align: left !important');
    expect(css).toContain('vertical-align: top !important');
    expect(css).toContain(`a[data-link-id="${linkId}"]`);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Applying alignment styles for link 1, textAlign: null, verticalAlign: null'
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Applied alignment styles for link 1: textAlign=left, verticalAlign=top'
    );
  });

  it('should map textAlign "1" → "center" and verticalAlign "2" → "bottom"', () => {
    applyAlignmentStyles(element, '1', '2', index, linkId);

    // Inline-стили применяются
    expect(element.style.textAlign).toBe('center');
    expect(element.style.verticalAlign).toBe('bottom');

    const styleEl = document.head.querySelector('style');
    const css = styleEl?.textContent || '';

    expect(css).toContain('text-align: center !important');
    expect(css).toContain('vertical-align: bottom !important');
    expect(css).toContain(`a[data-link-id="${linkId}"]`);
  });

  it('should fallback to "left" if textAlign is invalid', () => {
    applyAlignmentStyles(element, '999', null, index, linkId);

    // textAlign = '999' → invalid → appliedTextAlign = 'left'
    // НО: if (textAlign) → true (строка), поэтому inline применяется!
    expect(element.style.textAlign).toBe('left');
    expect(element.style.verticalAlign).toBe('');

    const css = document.head.querySelector('style')?.textContent || '';
    expect(css).toContain('text-align: left !important');
    expect(css).toContain('vertical-align: top !important');
  });

  it('should fallback to "top" if verticalAlign is invalid', () => {
    applyAlignmentStyles(element, null, 'invalid', index, linkId);

    // verticalAlign = 'invalid' → invalid → appliedVerticalAlign = 'top'
    // if (verticalAlign) → true → inline применяется
    expect(element.style.textAlign).toBe('');
    expect(element.style.verticalAlign).toBe('top');

    const css = document.head.querySelector('style')?.textContent || '';
    expect(css).toContain('text-align: left !important');
    expect(css).toContain('vertical-align: top !important');
  });

  it('should target both .notion-quote-block and .notion-callout-block', () => {
    applyAlignmentStyles(element, '2', '1', index, linkId);

    const css = document.head.querySelector('style')?.textContent || '';

    expect(css).toContain('.notion-quote-block div:has(a[data-link-id="link-123"])');
    expect(css).toContain('.notion-callout-block div:has(a[data-link-id="link-123"])');
    expect(css).toContain('text-align: right !important');
    expect(css).toContain('vertical-align: middle !important');
  });

  it('should append <style> to document.head', () => {
    expect(document.head.querySelectorAll('style').length).toBe(0);
    applyAlignmentStyles(element, null, null, index, linkId);
    expect(document.head.querySelectorAll('style').length).toBe(1);
  });

  it('should work with different index values', () => {
    applyAlignmentStyles(element, '1', '1', 5, linkId);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Applying alignment styles for link 6, textAlign: 1, verticalAlign: 1'
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Applied alignment styles for link 6: textAlign=center, verticalAlign=middle'
    );
  });
});