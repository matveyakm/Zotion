import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addTooltipListeners } from '../../../../src/modules/DOMModifier/annotation/tooltip';

type FrameRequestCallback = Parameters<typeof window.requestAnimationFrame>[0];

describe('tooltip.ts — addTooltipListeners', () => {
  let link: HTMLAnchorElement;
  let tooltip: HTMLDivElement;
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let rafSpy: vi.MockInstance<FrameRequestCallback, number>;

  const index = 0;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    rafSpy = vi
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation(() => {
    
        return 123;
    });
    link = document.createElement('a');
    link.href = '#';
    document.body.appendChild(link);

    tooltip = document.createElement('div');
    tooltip.classList.add('annotation-tooltip');
    document.body.appendChild(tooltip);

    vi.spyOn(link, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      right: 200,
      top: 50,
      bottom: 70,
      width: 100,
      height: 20,
    } as DOMRect);

    vi.spyOn(tooltip, 'getBoundingClientRect').mockReturnValue({
      width: 150,
      height: 80,
      left: 0,
      top: 0,
      right: 150,
      bottom: 80,
    } as DOMRect);

    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(800);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(600);
    vi.spyOn(window, 'scrollX', 'get').mockReturnValue(0);
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0);

    addTooltipListeners(link, tooltip, index);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  const dispatchEvent = (type: string): MouseEvent => {
    const event = new MouseEvent(type, { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    return event;
  };

  describe('click listener', () => {
    it('should prevent default and log on click', () => {
      const event = dispatchEvent('click');
      expect(event.defaultPrevented).toBe(true);
      expect(consoleLogSpy).toHaveBeenCalledWith('Click prevented for annotation link 1');
    });
  });

  describe('mouseover listener', () => {
    it('should log on mouseover', () => {
      dispatchEvent('mouseover');
      expect(consoleLogSpy).toHaveBeenCalledWith('Mouseover prevented for link 1');
    });
  });

  describe('mouseenter listener', () => {
    it('should position and show tooltip correctly (default case)', () => {
      dispatchEvent('mouseenter');

      // 1. Лог при входе
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Mouseenter triggered for link 1'),
        expect.any(MouseEvent)
      );

      // 2. Состояние ДО RAF
      expect(tooltip.style.display).toBe('block');
      expect(tooltip.style.opacity).toBe('0');
      expect(tooltip.style.left).toBe('-9999px');
      expect(tooltip.style.top).toBe('0px');

      // 3. Извлекаем и вызываем callback
      const callback = rafSpy.mock.calls[0]?.[0] as FrameRequestCallback | undefined;
      expect(callback).toBeDefined();
      callback?.(0);

      // 4. Состояние ПОСЛЕ RAF
      expect(tooltip.style.top).toBe('78px');
      expect(tooltip.style.left).toBe('100px');
      expect(tooltip.style.opacity).toBe('1');

      // 5. Лог позиционирования
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Tooltip positioned at left=100, top=78')
      );
    });

    it('should flip tooltip to left if not enough space on right', () => {
      vi.spyOn(link, 'getBoundingClientRect').mockReturnValue({
        left: 700,
        right: 800,
        top: 50,
        bottom: 70,
        width: 100,
        height: 20,
      } as DOMRect);

      dispatchEvent('mouseenter');

      const callback = rafSpy.mock.calls[0]?.[0] as FrameRequestCallback | undefined;
      callback?.(0);

      expect(tooltip.style.left).toBe('650px');
    });

    it('should flip tooltip above if not enough space below', () => {
      vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(100);
      vi.spyOn(link, 'getBoundingClientRect').mockReturnValue({
        left: 100,
        right: 200,
        top: 50,
        bottom: 90,
        width: 100,
        height: 40,
      } as DOMRect);

      dispatchEvent('mouseenter');

      const callback = rafSpy.mock.calls[0]?.[0] as FrameRequestCallback | undefined;
      callback?.(0);

      expect(parseFloat(tooltip.style.top)).toBeCloseTo(-38, 0);
    });
  });

  describe('mouseleave listener', () => {
    it('should hide tooltip on mouseleave', () => {
      tooltip.style.display = 'block';
      tooltip.style.opacity = '1';

      dispatchEvent('mouseleave');

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Mouseleave triggered for link 1'),
        expect.any(MouseEvent)
      );
      expect(tooltip.style.display).toBe('none');
      expect(tooltip.style.opacity).toBe('0');
      expect(consoleLogSpy).toHaveBeenCalledWith('Tooltip hidden for link 1');
    });
  });

  it('should handle scroll offset', () => {
    vi.spyOn(window, 'scrollX', 'get').mockReturnValue(50);
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(100);

    dispatchEvent('mouseenter');

    const callback = rafSpy.mock.calls[0]?.[0] as FrameRequestCallback | undefined;
    callback?.(0);

    expect(tooltip.style.left).toBe('150px');
    expect(tooltip.style.top).toBe('178px');
  });
});