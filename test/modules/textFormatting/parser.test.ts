import { describe, it, expect } from 'vitest';
import { parseLinkAttributes } from '../../../src/modules/DOMModifier/parser';

describe('parseLinkAttributes', () => {
    it('should return attributes array when href contains valid attributes', () => {
        const href = 'https://exam.ple.com/#0.8.aaffff.440000.1.ffaaff.0.1.6.9.0.0.0#';
        const result = parseLinkAttributes(href);
        expect(result).toEqual({ attributes: ['0', '8', 'aaffff', '440000', '1', 'ffaaff', '0', '1', '6', '9', '0', '0', '0'] });
    });

    it('should return null when href does not match any pattern', () => {
        const href = 'https://ex.amp.le.com';
        const result = parseLinkAttributes(href);
        expect(result).toBeNull();
    });

    it('should return an empty attributes array when href contains an empty attributes section', () => {
        const href = 'https://example.com/##';
        const result = parseLinkAttributes(href);
        expect(result).toBeNull();
    });

    it('should return attributes array with a single attribute when href contains one valid attribute', () => {
        const href = 'https://example.com/#0.8.aaffff#';
        const result = parseLinkAttributes(href);
        expect(result).toEqual({ attributes: ['0', '8', 'aaffff'] });
    });

    it('should return null when href contains a malformed color pattern', () => {
        const href = 'https://example.com//color=#ZZZZZZ';
        const result = parseLinkAttributes(href);
        expect(result).toBeNull();
    });

    it('should return attributes array when href contains attributes with numbers', () => {
        const href = 'https://example.com/#0.8.abc123.f#';
        const result = parseLinkAttributes(href);
        expect(result).toEqual({ attributes: ['0', '8', 'abc123', 'f'] });
    });

    it('should return null when href contains a valid color but in the wrong format', () => {
        const href = 'https://example.com/color=#ff5733';
        const result = parseLinkAttributes(href);
        expect(result).toBeNull();
    });

    it('should return attributes array when href contains attributes with special characters', () => {
        const href = 'https://example.com/#0.8.eeffee.A#';
        const result = parseLinkAttributes(href);
        expect(result).toEqual({ attributes: ['0', '8', 'eeffee', 'A'] });
    });

    it('should return null when href contains an empty string', () => {
        const href = '';
        const result = parseLinkAttributes(href);
        expect(result).toBeNull();
    });

    it('should return null when href contains only the color pattern without a valid color', () => {
        const href = 'https://example.com//color=#';
        const result = parseLinkAttributes(href);
        expect(result).toBeNull();
    });

    it('should return attributes array when href contains attributes with dots at the start and end', () => {
        const href = 'https://example.com/#0...22ffAA.#';
        const result = parseLinkAttributes(href);
        expect(result).toEqual({ attributes: ['0', '', '', '22ffAA', ''] });
    });
});
