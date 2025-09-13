import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { setupMutationObserver } from '../../../src/modules/DOMModifier/init';
import { processAttributedLinks } from '../../../src/modules/DOMModifier/scanner';
import { debounce } from '../../../src/modules/DOMModifier/debounce';

vi.mock('../../../src/modules/DOMModifier/scanner', () => ({
  processAttributedLinks: vi.fn(),
}));

vi.mock('../../../src/modules/DOMModifier/debounce', () => ({
  debounce: vi.fn((fn: (...args: unknown[]) => void) => fn),
}));

describe('setupMutationObserver', () => {
  const debounceMock = vi.fn((fn: (...args: unknown[]) => void) => fn);

  let observerSpy: vi.SpyInstance;

  beforeEach(() => {
    vi.clearAllMocks();
  
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

  it('should call processAttributedLinks when mutations occur', () => {
    setupMutationObserver();

    const observerInstance = observerSpy.mock.results[0].value;
    const mockMutation = {
        target: document.createElement('div'),
    } as unknown as MutationRecord;

    (mockMutation.target as HTMLElement).classList.add('notion-text-block');
    observerInstance.callback([mockMutation], observerInstance);

    expect(processAttributedLinks).toHaveBeenCalledWith(mockMutation.target);
  });

  it('should debounce the mutation processing', () => {
    setupMutationObserver();

    expect(debounce).toHaveBeenCalledWith(expect.any(Function), 2000);
  });
});
