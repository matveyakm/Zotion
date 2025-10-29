// diverStyle.ts

import { ParsedData } from '../scanner';
import { processRGB } from './colorStyler';

export function applyDividerStyles(link: HTMLAnchorElement, parsedData: ParsedData, index: number, isDarkTheme: boolean): void {
  console.log(`Applying divider styles for link ${index + 1}, attributes:`, parsedData.attributes);

  const attributes = parsedData.attributes;
  if (!attributes) {
    console.log(`Link ${index + 1} - No attributes found`);
    return;
  }

  const textBlock = link.closest('.notion-text-block');
  if (!(textBlock instanceof HTMLElement)) {
    console.log(`Link ${index + 1} - notion-text-block not found`);
    return;
  }
  textBlock.style.display = 'none';

  const dividerBlock = textBlock.nextElementSibling?.closest('.notion-divider-block');
  if (!(dividerBlock instanceof HTMLElement)) {
    console.log(`Link ${index + 1} - notion-divider-block not found`);
    return;
  }

  const separator = dividerBlock.querySelector('div[role="separator"]');
  if (!(separator instanceof HTMLElement)) {
    console.log(`Link ${index + 1} - Separator element not found`);
    return;
  }

  // Добавляем уникальный атрибут для селектора
  const linkId = `link-${index}-${Date.now()}`;
  link.setAttribute('data-link-id', linkId);
  separator.setAttribute('data-divider-id', linkId);

  let borderWidth = 1;
  let borderColor = getComputedStyle(separator).borderBottomColor;

  if (attributes[1]) {
    borderWidth = Math.max(1, parseInt(attributes[1], 16));
    if (isNaN(borderWidth)) {
      console.log(`Link ${index + 1} - Invalid border width:`, attributes[1]);
      borderWidth = 1;
    }
  }

  if (attributes[2]) {
    const hexColor = attributes[2].match(/[0-9a-fA-F]{7}/)?.[0] || 'NULL';
    const rgba = processRGB(hexColor, isDarkTheme ? 'dark' : 'light', 'full');
    if (rgba) {
        borderColor = rgba;
    }
  }

  applyDividerBorderStyles(separator, borderColor, borderWidth);
}

function applyDividerBorderStyles(element: HTMLElement, borderColor: string, borderWidth: number): void {
    element.style.borderBottom = ''; 
    element.style.setProperty('border-bottom', `${borderWidth}px solid ${borderColor}`, 'important');
}

function normalizeColor(color: string): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const computedColor = ctx.getImageData(0, 0, 1, 1).data;
    return `rgb(${computedColor[0]}, ${computedColor[1]}, ${computedColor[2]})`;
  }

// Деактивирована, т.к. вызывается слишком часто и вызывает лаги. Некорректно определяет цвет фона
export function adjustDividers(container: ParentNode = document): void {
    console.log('Adjusting divider styles in callout blocks');
  
    const calloutBlocks = container.querySelectorAll('.notion-selectable.notion-callout-block');
    if (!calloutBlocks.length) {
      console.log('No callout blocks found');
      return;
    }
  
    calloutBlocks.forEach((callout, index) => {
      if (!(callout instanceof HTMLElement)) {
        console.log(`Callout block ${index + 1} is not an HTMLElement`);
        return;
      }
  
      const dividerBlocks = callout.querySelectorAll('.notion-selectable.notion-divider-block');
      if (!dividerBlocks.length) {
        console.log(`No divider blocks found in callout ${index + 1}`);
        return;
      }
  
      dividerBlocks.forEach((divider, dividerIndex) => {
        if (!(divider instanceof HTMLElement)) {
          console.log(`Divider block ${dividerIndex + 1} in callout ${index + 1} is not an HTMLElement`);
          return;
        }
  
        const separator = divider.querySelector('div[role="separator"]');
        if (!(separator instanceof HTMLElement)) {
          console.log(`Separator not found in divider block ${dividerIndex + 1} in callout ${index + 1}`);
          return;
        }
  
        const currentBorderColor = getComputedStyle(separator).borderBottomColor;
        const primaryBorderColor = getComputedStyle(document.documentElement).getPropertyValue('--c-borPri').trim();
        const separatorStyle = separator.style.borderBottom;
  
        console.log(`Divider ${dividerIndex + 1} in callout ${index + 1} - Current border color: ${currentBorderColor}, Expected --c-borPri: ${primaryBorderColor}, Separator style: ${separatorStyle}`);
  
        const calloutContent = callout.querySelector('div[style*="background"]');
        if (!(calloutContent instanceof HTMLElement)) {
          console.log(`Callout content with background not found in callout ${index + 1}`);
          return;
        }
  
        const calloutBackground = getComputedStyle(calloutContent).backgroundColor;
        const calloutBorderColor = getComputedStyle(calloutContent).borderColor;
  
        const backgroundColorMap: { [key: string]: string } = {
          [normalizeColor(getComputedStyle(document.documentElement).getPropertyValue('--c-graBacSec').trim())]: 'rgba(255, 255, 255, 0.3)',
          [normalizeColor(getComputedStyle(document.documentElement).getPropertyValue('--c-broBacSec').trim())]: 'rgb(120, 90, 70)',
          [normalizeColor(getComputedStyle(document.documentElement).getPropertyValue('--c-oraBacSec').trim())]: 'rgb(130, 85, 60)',
          [normalizeColor(getComputedStyle(document.documentElement).getPropertyValue('--c-yelBacSec').trim())]: 'rgb(130, 100, 60)',
          [normalizeColor(getComputedStyle(document.documentElement).getPropertyValue('--c-greBacSec').trim())]: 'rgb(80, 100, 85)',
          [normalizeColor(getComputedStyle(document.documentElement).getPropertyValue('--c-bluBacSec').trim())]: 'rgb(80, 100, 130)',
          [normalizeColor(getComputedStyle(document.documentElement).getPropertyValue('--c-purBacSec').trim())]: 'rgb(100, 80, 120)',
          [normalizeColor(getComputedStyle(document.documentElement).getPropertyValue('--c-pinBacSec').trim())]: 'rgb(120, 75, 95)',
          [normalizeColor(getComputedStyle(document.documentElement).getPropertyValue('--c-redBacSec').trim())]: 'rgb(130, 80, 75)',
        };
  
        console.log(`Callout ${index + 1} - Background color: ${calloutBackground}, Border color: ${calloutBorderColor}`);
        console.log(`Callout ${index + 1} - Background variables (normalized):`, Object.fromEntries(Object.entries(backgroundColorMap).map(([key, value]) => [key, value])));
  
        let newBorderColor = 'rgb(80, 80, 80)'; // Запасной цвет
        for (const [bgVar, color] of Object.entries(backgroundColorMap)) {
          if (calloutBackground === bgVar) {
            newBorderColor = color;
            console.log(`Callout ${index + 1} - Matched background to normalized var value`);
            break;
          }
        }
  
        applyDividerBorderStyles(separator, newBorderColor, 1);
        console.log(`Adjusted divider ${dividerIndex + 1} in callout ${index + 1} with border color: ${newBorderColor}`);
      });
    });
  }