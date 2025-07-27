import { describe, it, expect, vi } from 'vitest';
import { debounce } from '../../../src/modules/textFormatting/debounce';

// debounce.test.ts

describe('debounce', () => {
    it('should call the function after the specified wait time', async () => {
        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 200);

        debouncedFn();
        expect(mockFn).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve, 250));
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should call the function only once if called multiple times within the wait time', async () => {
        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 200);

        debouncedFn();
        debouncedFn();
        debouncedFn();

        expect(mockFn).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve, 250));
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should reset the wait time if called again before the wait time expires', async () => {
        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 200);

        debouncedFn();
        await new Promise((resolve) => setTimeout(resolve, 100));
        debouncedFn();
        await new Promise((resolve) => setTimeout(resolve, 150));

        expect(mockFn).not.toHaveBeenCalled();

        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should preserve the context when calling the debounced function', async () => {
        const mockFn = vi.fn(function (this: { value: number }) {
            return this.value;
        });
        const context = { value: 42 };
        const debouncedFn = debounce(mockFn.bind(context), 200);

        debouncedFn();
        await new Promise((resolve) => setTimeout(resolve, 250));

        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn.mock.results[0].value).toBe(42);
    });
});