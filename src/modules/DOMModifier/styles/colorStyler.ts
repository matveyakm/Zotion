// colorStyler.ts
import { needToAdjustColors } from "../constants";

function hexToRGBA(hex: string): RGBA | null {
    if (!([6,7].includes(hex.length))) return null;
    var r = parseInt(hex.slice(0, 2), 16);
    var g = parseInt(hex.slice(2, 4), 16);
    var b = parseInt(hex.slice(4, 6), 16);
    const a = hex.length == 6? 1 : parseInt(hex[6], 16) / 16;
    return { r, g, b, a };
}

export function processRGB(hex: string, background: "dark" | "light", method: "full" | "simple" | "none"): string | null {
    const rgba = hexToRGBA(hex);
    if (!rgba) return null;

    var contrasted: RGBA;
    if (method === "none" || !needToAdjustColors) {
        contrasted = rgba;
    } else if (method === "full") {
        contrasted = adjustRGBA(rgba, background, 4.5) 
    } else {
        contrasted = simpleAdjustRGBA(rgba, background)
    }

    if (rgba.r != contrasted.r || rgba.g != contrasted.g || rgba.b != contrasted.b || rgba.a != contrasted.a){
        console.log(`Adjusted color #${hex}(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a}) to rgba(${contrasted.r}, ${contrasted.g}, ${contrasted.b}, ${contrasted.a}) for ${background} background using ${method} method`);
    }
    
    return `rgba(${contrasted.r}, ${contrasted.g}, ${contrasted.b}, ${contrasted.a})`;
}

function simpleAdjustRGBA({ r, g, b, a}: RGBA, background: "dark" | "light"): RGBA {
    const factor = background === "dark" ? 0.6 : 1.67;
    const bound = 80;
    return {
        r: background === "dark" ? (r < bound ? r * factor : r) : (r > 255 - bound ? 255 - (255 - r) * factor : r),
        g: background === "dark" ? (g < bound ? g * factor : g) : (g > 255 - bound ? 255 - (255 - g) * factor : g),
        b: background === "dark" ? (b < bound ? b * factor : b) : (b > 255 - bound ? 255 - (255 - b) * factor : b),
        a: a
    };
}

type RGBA = { r: number; g: number; b: number; a: number };
type RGB = { r: number; g: number; b: number };

function rgbToHsl({ r, g, b }: RGB): [number, number, number] {
  const r1 = r / 255, g1 = g / 255, b1 = b / 255;
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0, s = 0;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r1) h = ((g1 - b1) / d) % 6;
    else if (max === g1) h = (b1 - r1) / d + 2;
    else h = (r1 - g1) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s, l];
}

function hslToRgb([h, s, l]: [number, number, number]): RGB {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r1 = 0, g1 = 0, b1 = 0;
  if (h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h < 180) [r1, g1, b1] = [0, c, x];
  else if (h < 240) [r1, g1, b1] = [0, x, c];
  else if (h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];
  return { r: Math.round((r1 + m) * 255), g: Math.round((g1 + m) * 255), b: Math.round((b1 + m) * 255) };
}

function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance({ r, g, b }: RGB): number {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrastRatio(rgbA: RGB, rgbB: RGB): number {
  const La = luminance(rgbA), Lb = luminance(rgbB);
  const Lbright = Math.max(La, Lb);
  const Ldark = Math.min(La, Lb);
  return (Lbright + 0.05) / (Ldark + 0.05);
}

function blendOver(bg: RGB, fg: RGBA): RGB {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
  };
}

function adjustRGBA(fg: RGBA, background: "light" | "dark", targetContrast = 4.5): RGBA {
  const bg: RGB = background === "dark" ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 };

  // Проверка контраста исходного цвета
  const initialComp = blendOver(bg, fg);
  const initialContrast = contrastRatio(initialComp, bg);
  if (initialContrast >= targetContrast) return fg;

  const [h, s, lOrig] = rgbToHsl(fg);
  
  // Инициализация диапазона поиска
  let low = 0;
  let high = background === "light" ? lOrig : 1; // Ограничиваем верхнюю границу для светлого фона
  let bestL = lOrig;
  let bestContrast = initialContrast;

  // Бинарный поиск
  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2;
    const candidateRgb = hslToRgb([h, s, mid]);
    const candidateComp = blendOver(bg, { ...candidateRgb, a: fg.a });
    const cRatio = contrastRatio(candidateComp, bg);

    // Обновляем лучшее значение, если контраст ближе к целевому
    if (Math.abs(cRatio - targetContrast) < Math.abs(bestContrast - targetContrast) || cRatio >= targetContrast) {
      bestL = mid;
      bestContrast = cRatio;
    }

    // Если контраст достаточно близок или диапазон узкий, завершаем
    if (Math.abs(cRatio - targetContrast) < 0.01 || Math.abs(high - low) < 0.0001) {
      break;
    }

    if (background === "light") {
      // Для светлого фона нужно уменьшить яркость
      if (cRatio < targetContrast) {
        // Контраст недостаточен, делаем темнее
        high = mid;
      } else {
        // Контраст достаточен, пробуем ещё темнее для минимального изменения
        low = mid;
      }
    } else {
      // Для тёмного фона нужно увеличить яркость
      if (cRatio < targetContrast) {
        // Контраст недостаточен, делаем светлее
        low = mid;
      } else {
        // Контраст достаточен, пробуем ещё светлее для минимального изменения
        high = mid;
      }
    }
  }

  // Если контраст всё ещё недостаточен, используем лучшее найденное значение
  const resultRgb = hslToRgb([h, s, bestL]);
  return { ...resultRgb, a: fg.a };
}

export function evaluateBackground(hex: string, isDarkTheme: boolean): "light" | "dark" {
    const background = hexToRGBA(hex);
    if (!background) return isDarkTheme ? "dark" : "light";

    // Если альфа меньше 1, накладываем фон на белый цвет для светлого контекста
    const defaultBg: RGB = isDarkTheme ? {r: 25, g: 25, b: 25} : { r: 255, g: 255, b: 255 };
    const effectiveBg = blendOver(defaultBg, background);
    
    // Вычисляем яркость фона
    const lum = luminance(effectiveBg);
    
    // Порог 0.5: если яркость больше, фон светлый, иначе тёмный
    console.log(`Evaluated background #${hex} as ${lum > 0.5 ? "light" : "dark"} (luminance: ${lum.toFixed(3)})`);
    return lum > 0.5 ? "light" : "dark";
  }