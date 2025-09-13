import { describe, it, expect, vi } from 'vitest';
import { injectStyles, processedLinks } from '../../../src/modules/DOMModifier/constants';

describe('constants.ts', () => {
    it('should add a style element to the document head when injectStyles is called', () => {
        const appendChildSpy = vi.spyOn(document.head, 'appendChild');

        injectStyles();

        // Проверяем, что appendChild был вызван с элементом <style>
        expect(appendChildSpy).toHaveBeenCalledOnce();
        const appendedElement = appendChildSpy.mock.calls[0][0] as HTMLStyleElement;
        expect(appendedElement.tagName).toBe('STYLE');
        expect(appendedElement.textContent).toContain('a[data-styled="true"][data-icon="true"]::before');

        // Возвращаем оригинальную реализацию
        appendChildSpy.mockRestore();
    });

    it('should log a message with the current timestamp when injectStyles is called', () => {
        const consoleLogSpy = vi.spyOn(console, 'log');

        injectStyles();

        // Проверяем, что console.log был вызван с правильным сообщением
        expect(consoleLogSpy).toHaveBeenCalledOnce();
        expect(consoleLogSpy).toHaveBeenCalledWith(
            'Content script loaded successfully at',
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        );

        // Возвращаем оригинальную реализацию
        consoleLogSpy.mockRestore();
    });

    it('should initialize processedLinks as an empty WeakSet', () => {
        expect(processedLinks).toBeInstanceOf(WeakSet);
        expect(processedLinks.has(document.createElement('div'))).toBe(false);
    });
});