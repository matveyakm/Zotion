import { describe, it, expect, vi } from 'vitest';
import { injectStyles, processedLinks } from '../../../src/modules/textFormatting/constants';

describe('constants.ts', () => {
    it('should add a style element to the document head when injectStyles is called', () => {
        // Mock document.head.appendChild
        const appendChildSpy = vi.spyOn(document.head, 'appendChild');

        injectStyles();

        // Check if a style element was appended to the document head
        expect(appendChildSpy).toHaveBeenCalledOnce();
        const appendedElement = appendChildSpy.mock.calls[0][0] as HTMLStyleElement;
        expect(appendedElement.tagName).toBe('STYLE');
        expect(appendedElement.textContent).toContain('a[data-styled="true"][data-icon="true"]::before');

        // Restore the original implementation
        appendChildSpy.mockRestore();
    });

    it('should log a message with the current timestamp when injectStyles is called', () => {
        // Mock console.log
        const consoleLogSpy = vi.spyOn(console, 'log');

        injectStyles();

        // Check if console.log was called with the expected message
        expect(consoleLogSpy).toHaveBeenCalledOnce();
        expect(consoleLogSpy).toHaveBeenCalledWith(
            'Content script loaded successfully at',
            expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        );

        // Restore the original implementation
        consoleLogSpy.mockRestore();
    });

    it('should initialize processedLinks as an empty WeakSet', () => {
        expect(processedLinks).toBeInstanceOf(WeakSet);
        expect(processedLinks.has(document.createElement('div'))).toBe(false);
    });
});