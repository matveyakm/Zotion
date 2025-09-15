export function parseRGB(hex: string, isDarkTheme: boolean): string | null {
    if (!([6,7].includes(hex.length))) return null;
    const r = (isDarkTheme ? 1 : 0.7) * parseInt(hex.slice(0, 2), 16);
    const g = (isDarkTheme ? 1 : 0.7) * parseInt(hex.slice(2, 4), 16);
    const b = (isDarkTheme ? 1 : 0.7) * parseInt(hex.slice(4, 6), 16);
    if (hex.length === 6) return `rgb(${r}, ${g}, ${b})`;
    const a = parseInt(hex[6], 16) / 16;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}