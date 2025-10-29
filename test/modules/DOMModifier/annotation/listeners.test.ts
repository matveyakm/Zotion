import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupGlobalListeners } from '../../../../src/modules/DOMModifier/annotation/listeners';

describe('listeners.ts — setupGlobalListeners', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let visibilityChangeHandler: () => void;
  let resizeHandler: () => void;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.clearAllMocks();

    // Сохраняем ссылки на добавленные обработчики
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener');

    setupGlobalListeners();

    // Извлекаем добавленные обработчики
    const visibilityCall = addEventListenerSpy.mock.calls.find(
      call => call[0] === 'visibilitychange'
    );
    visibilityChangeHandler = visibilityCall?.[1] as () => void;

    const resizeCall = windowAddEventListenerSpy.mock.calls.find(
      call => call[0] === 'resize'
    );
    resizeHandler = resizeCall?.[1] as () => void;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  const createTooltip = (id: string = 'tooltip-1'): HTMLDivElement => {
    const tooltip = document.createElement('div');
    tooltip.classList.add('annotation-tooltip');
    tooltip.id = id;
    tooltip.style.display = 'block';
    tooltip.style.opacity = '1';
    document.body.appendChild(tooltip);
    return tooltip;
  };

  describe('visibilitychange listener', () => {
    it('should add visibilitychange listener with { once: false }', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
      setupGlobalListeners();

      const call = addEventListenerSpy.mock.calls.find(c => c[0] === 'visibilitychange');
      expect(call).toBeDefined();
      expect(call?.[2]).toEqual({ once: false });
    });

    it('should hide all tooltips and log when page becomes hidden', () => {
      createTooltip('t1');
      createTooltip('t2');

      // Симулируем document.hidden = true
      Object.defineProperty(document, 'visibilityState', {
        value: 'hidden',
        writable: true,
      });

      visibilityChangeHandler();

      const tooltips = document.querySelectorAll('.annotation-tooltip');
      tooltips.forEach(tooltip => {
        expect(tooltip.style.display).toBe('none');
        expect(tooltip.style.opacity).toBe('0');
      });

      expect(consoleLogSpy).toHaveBeenCalledWith('All tooltips hidden due to visibilitychange');
    });

    it('should do nothing when page is visible', () => {
      createTooltip();

      Object.defineProperty(document, 'visibilityState', {
        value: 'visible',
        writable: true,
      });

      visibilityChangeHandler();

      const tooltip = document.querySelector('.annotation-tooltip')!;
      expect(tooltip.style.display).toBe('block'); // не изменилось
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe('resize listener', () => {
    it('should add resize listener with { passive: true }', () => {
      const windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener');
      setupGlobalListeners();

      const call = windowAddEventListenerSpy.mock.calls.find(c => c[0] === 'resize');
      expect(call).toBeDefined();
      expect(call?.[2]).toEqual({ passive: true });
    });

    it('should hide all tooltips and log on window resize', () => {
      createTooltip('t1');
      createTooltip('t2');

      resizeHandler();

      document.querySelectorAll('.annotation-tooltip').forEach(tooltip => {
        expect(tooltip.style.display).toBe('none');
        expect(tooltip.style.opacity).toBe('0');
      });

      expect(consoleLogSpy).toHaveBeenCalledWith('All tooltips hidden due to window resize');
    });

    it('should handle empty tooltip list gracefully', () => {
        resizeHandler();
      
        
        expect(document.querySelectorAll('.annotation-tooltip').length).toBe(0);
      });
  });

  it('should work with multiple tooltips and mixed states', () => {
    const t1 = createTooltip('t1');
    const t2 = createTooltip('t2');
    t1.style.opacity = '0.5';

    Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
    visibilityChangeHandler();

    expect(t1.style.display).toBe('none');
    expect(t1.style.opacity).toBe('0');
    expect(t2.style.display).toBe('none');
    expect(t2.style.opacity).toBe('0');

    expect(consoleLogSpy).toHaveBeenCalledWith('All tooltips hidden due to visibilitychange');
  });
});