import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { setupMutationObserver } from '../../../src/modules/textFormatting/init';
import { processTextStyleLinks } from '../../../src/modules/textFormatting/scanner';
import { debounce } from '../../../src/modules/textFormatting/debounce';

vi.mock('../../../src/modules/textFormatting/scanner', () => ({
  processTextStyleLinks: vi.fn(),
}));

vi.mock('../../../src/modules/textFormatting/debounce');

describe('setupMutationObserver', () => {
  const debounceMock = vi.fn((fn: (...args: unknown[]) => void) => fn);

  let observerSpy: vi.SpyInstance;

  beforeEach(() => {
    (debounce as unknown as vi.Mock).mockImplementation(debounceMock);
    debounceMock.mockClear();

    // Мокаем MutationObserver
    observerSpy = vi.spyOn(global, 'MutationObserver').mockImplementation((callback) => {
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
        takeRecords: vi.fn(),
        callback,
      } as unknown as MutationObserver;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a MutationObserver and observe the document body', () => {
    setupMutationObserver();

    expect(observerSpy).toHaveBeenCalled();
    const observerInstance = observerSpy.mock.results[0].value;
    expect(observerInstance.observe).toHaveBeenCalledWith(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href', 'style', 'class'],
      attributeOldValue: true,
    });
  });

  it('should call processTextStyleLinks when mutations occur', () => {
    setupMutationObserver();

    const observerInstance = observerSpy.mock.results[0].value;
    const mockMutation = {
        target: document.createElement('div'),
    } as unknown as MutationRecord;

    (mockMutation.target as HTMLElement).classList.add('notion-text-block');
    observerInstance.callback([mockMutation], observerInstance);

    expect(processTextStyleLinks).toHaveBeenCalledWith(mockMutation.target);
  });

  it('should debounce the mutation processing', () => {
    setupMutationObserver();

    expect(debounceMock).toHaveBeenCalledWith(expect.any(Function), 2000);
  });
});
