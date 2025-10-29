// test/modules/DOMModifier/styles/colorStyler.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { processRGB, evaluateBackground } from '../../../../src/modules/DOMModifier/styles/colorStyler';
import * as constants from '../../../../src/modules/DOMModifier/constants';

vi.mock('../../../../src/modules/DOMModifier/constants', () => ({
  needToAdjustColors: true,
}));

describe('colorStyler.ts', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('processRGB', () => {
    it('возвращает null для некорректного hex', () => {
      expect(processRGB('ZZZ', 'light', 'full')).toBeNull();
      expect(processRGB('12345', 'dark', 'simple')).toBeNull();
      expect(processRGB('', 'light', 'none')).toBeNull();
    });

    it('возвращает исходный цвет в rgba при method="none"', () => {
      expect(processRGB('FF00FF', 'light', 'none')).toBe('rgba(255, 0, 255, 1)');
      expect(processRGB('00FF008', 'dark', 'none')).toBe('rgba(0, 255, 0, 0.5)');
    });

    it('возвращает исходный цвет, если needToAdjustColors = false', () => {
      vi.spyOn(constants, 'needToAdjustColors', 'get').mockReturnValue(false);
      expect(processRGB('101010', 'light', 'full')).toBe('rgba(16, 16, 16, 1)');
    });

    it('корректирует цвет на светлом фоне (simple)', () => {
      const result = processRGB('E0E0E0', 'light', 'simple');
      expect(result).toBe('rgba(203.23000000000002, 203.23000000000002, 203.23000000000002, 1)');
    });

    it('корректирует цвет на тёмном фоне (simple)', () => {
      const result = processRGB('111111', 'dark', 'simple');
      expect(result).toBe('rgba(10.2, 10.2, 10.2, 1)');
    });

    it('обрабатывает альфа-канал', () => {
      expect(processRGB('FF00FF8', 'light', 'none')).toBe('rgba(255, 0, 255, 0.5)');
    });
  });

  describe('evaluateBackground', () => {
    it('возвращает "light" для светлого фона', () => {
      expect(evaluateBackground('FFFFFF', false)).toBe('light');
      expect(evaluateBackground('FFFFFF8', false)).toBe('light');
    });

    it('возвращает "dark" для тёмного фона', () => {
      expect(evaluateBackground('000000', true)).toBe('dark');
      expect(evaluateBackground('1A1A1A', true)).toBe('dark');
    });

    it('учитывает альфа-канал и фон по умолчанию', () => {
      expect(evaluateBackground('8080808', false)).toBe('light');
      expect(evaluateBackground('8080808', true)).toBe('dark');
    });

    it('логирует оценку фона', () => {
      evaluateBackground('123456', false);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Evaluated background #123456')
      );
    });

    it('возвращает дефолт по теме, если hex некорректный', () => {
      expect(evaluateBackground('ZZZ', true)).toBe('dark');
      expect(evaluateBackground('ZZZ', false)).toBe('light');
    });
  });
});