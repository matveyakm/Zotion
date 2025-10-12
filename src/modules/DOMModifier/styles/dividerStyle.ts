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
    let hexColor = attributes[2].match(/[0-9a-fA-F]{7}/)?.[0] || 'NULL';
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
        const inlineStyle = calloutContent.style.background || calloutContent.style.backgroundColor;
  
        const backgroundVars = {
          'var(--c-graBacSec)': getComputedStyle(document.documentElement).getPropertyValue('--c-graBacSec').trim(),
          'var(--c-broBacSec)': getComputedStyle(document.documentElement).getPropertyValue('--c-broBacSec').trim(),
          'var(--c-oraBacSec)': getComputedStyle(document.documentElement).getPropertyValue('--c-oraBacSec').trim(),
          'var(--c-yelBacSec)': getComputedStyle(document.documentElement).getPropertyValue('--c-yelBacSec').trim(),
          'var(--c-greBacSec)': getComputedStyle(document.documentElement).getPropertyValue('--c-greBacSec').trim(),
          'var(--c-bluBacSec)': getComputedStyle(document.documentElement).getPropertyValue('--c-bluBacSec').trim(),
          'var(--c-purBacSec)': getComputedStyle(document.documentElement).getPropertyValue('--c-purBacSec').trim(),
          'var(--c-pinBacSec)': getComputedStyle(document.documentElement).getPropertyValue('--c-pinBacSec').trim(),
          'var(--c-redBacSec)': getComputedStyle(document.documentElement).getPropertyValue('--c-redBacSec').trim(),
        };
  
        console.log(`Callout ${index + 1} - Background color: ${calloutBackground}`);
        console.log(`Callout ${index + 1} - Inline style: ${inlineStyle}`);
        console.log(`Callout ${index + 1} - Background variables:`, backgroundVars);
  
        const backgroundColorMap: { [key: string]: string } = {
          [backgroundVars['var(--c-graBacSec)']]: 'rgba(255, 255, 255, 0.3)',
          [backgroundVars['var(--c-broBacSec)']]: 'rgb(120, 90, 70)',
          [backgroundVars['var(--c-oraBacSec)']]: 'rgb(130, 85, 60)',
          [backgroundVars['var(--c-yelBacSec)']]: 'rgb(130, 100, 60)',
          [backgroundVars['var(--c-greBacSec)']]: 'rgb(80, 100, 85)',
          [backgroundVars['var(--c-bluBacSec)']]: 'rgb(80, 100, 130)',
          [backgroundVars['var(--c-purBacSec)']]: 'rgb(100, 80, 120)',
          [backgroundVars['var(--c-pinBacSec)']]: 'rgb(120, 75, 95)',
          [backgroundVars['var(--c-redBacSec)']]: 'rgb(130, 80, 75)',
          'rgb(69, 54, 45)': 'rgb(120, 90, 70)', 
          'rgb(83, 54, 31)': 'rgb(130, 85, 60)', 
          'rgb(80, 68, 37)': 'rgb(130, 100, 60)', 
        };
  
        let newBorderColor = 'rgb(80, 80, 80)'; 
        for (const [bgVar, color] of Object.entries(backgroundColorMap)) {
          if (calloutBackground === bgVar) {
            newBorderColor = color;
            console.log(`Callout ${index + 1} - Matched background to [..]`);
            break;
          }
        }
  
        applyDividerBorderStyles(separator, newBorderColor, 1);
        console.log(`Adjusted divider ${dividerIndex + 1} in callout ${index + 1} with border color: ${newBorderColor}`);
      });
    });
  }