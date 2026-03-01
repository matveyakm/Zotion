import { annotationIDs } from "../../modules/DOMModifier/constants";
import { textAttributes, TextAttributes } from "../textPanel/textPanel";

const needToLog = false;

export const hrefLinkPrefix = "https://example.com/";

let lastUsedID: number | null = null;

export function applyHrefToSelection(href: string, isItABlock: boolean = false) {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      if (needToLog) console.log('Panel: Нет выделенного текста');
      return;
    }
  
    const range = selection.getRangeAt(0);
    const editable = range.commonAncestorContainer.parentElement?.closest('[contenteditable="true"]') as HTMLElement | null;
    if (!editable) {
      if (needToLog) console.log('Panel: Не найден contenteditable');
      return;
    }
  
    const existingA = range.startContainer.parentElement?.closest('a[href*="example.com"]');
    if (existingA) {
      if (needToLog) console.log('Panel: Снимаем существующую ссылку');
      document.execCommand('unlink', false);
      return;
    }
  
    if (needToLog) console.log('Panel: Начинаю эмуляцию Ctrl+K для создания ссылки с href:', href);
  
    editable.focus();
  
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const metaKey = isMac ? 'metaKey' : 'ctrlKey';
  
    const ctrlKDown = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'k',
      code: 'KeyK',
      keyCode: 75,
      which: 75,
      [metaKey]: true,
    });
    editable.dispatchEvent(ctrlKDown);
  
    const ctrlKUp = new KeyboardEvent('keyup', {
      bubbles: true,
      cancelable: true,
      key: 'k',
      code: 'KeyK',
      keyCode: 75,
      which: 75,
      [metaKey]: true,
    });
    editable.dispatchEvent(ctrlKUp);
  
    setTimeout(() => {
      const urlInput = document.querySelector('input[placeholder*="Paste link or search pages"]') as HTMLInputElement | null;
  
      if (!urlInput) {
        if (needToLog) console.warn('Panel: Input popup не найден');
        return;
      }
  
      if (needToLog) console.log('Panel: Нашли input popup, начинаем посимвольный ввод URL');
  
      urlInput.focus();
  
      urlInput.value = '';
  
      const typeChar = (char: string) => {
        const keyDown = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: char,
          code: `Key${char.toUpperCase() || 'Digit' + char}`,
        });
        urlInput.dispatchEvent(keyDown);
  
        urlInput.value += char;
        urlInput.dispatchEvent(new Event('input', { bubbles: true }));
  
        const keyUp = new KeyboardEvent('keyup', {
          bubbles: true,
          cancelable: true,
          key: char,
          code: `Key${char.toUpperCase() || 'Digit' + char}`,
        });
        urlInput.dispatchEvent(keyUp);
      };
  
      let i = 0;
      const interval = setInterval(() => {
        if (i < href.length) {
          typeChar(href[i]);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            const enterDown = new KeyboardEvent('keydown', {
              bubbles: true,
              cancelable: true,
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              which: 13,
            });
            urlInput.dispatchEvent(enterDown);
    
            const enterUp = new KeyboardEvent('keyup', {
              bubbles: true,
              cancelable: true,
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              which: 13,
            });
            urlInput.dispatchEvent(enterUp);
    
            if (needToLog) console.log('Panel: Ввод URL завершён, Enter отправлен');
          }, 10)
        }
      }, 3);
    }, 10);
}

export function generateHref(hrefLinkPrefix : string, textAttributes: TextAttributes) : string {
    let href = hrefLinkPrefix + "#" + [ 
        `${textAttributes.type.toString(16)}`, // 0
        textAttributes.size ? `${textAttributes.size.toString(16)}` : '', // 1
        textAttributes.textColor ? `${textAttributes.textColor}` : '', // 2
        textAttributes.backgroundColor ? `${textAttributes.backgroundColor}` : '', // 3
        textAttributes.decoration ? `${textAttributes.decoration}` : '', // 4
        textAttributes.decorationColor ? `${textAttributes.decorationColor}` : '', // 5
        textAttributes.fontStyle ? `${textAttributes.fontStyle}` : '', // 6
        textAttributes.fontWeight ? `${textAttributes.fontWeight}` : '', // 7
        textAttributes.letterSpacing ? `${textAttributes.letterSpacing.toString(16)}` : '', // 8
        textAttributes.wordSpacing ? `${textAttributes.wordSpacing.toString(16)}` : '', // 9
        textAttributes.lineHeight ? `${textAttributes.lineHeight.toString(16)}` : '', // 10
        textAttributes.textAlign ? `${textAttributes.textAlign}` : '', // 11
        textAttributes.verticalAlign ? `${textAttributes.verticalAlign}` : '', // 12
        [1, 2].includes(textAttributes.type) ? `${generateAnnotationID()}` : '' // 13 - только для аннотаций
    ].join('.') + "#";
    if (needToLog) console.log('Generated href:', href);
    return href;
}

function generateAnnotationID() {
  if (textAttributes.type === 2) {
    if (lastUsedID) {
      const newID = lastUsedID;
      lastUsedID = null;
      return `${newID}`;
    }
  } else {
    const idsAsInts = Array.from(annotationIDs).map(id => parseInt(id, 16));
    lastUsedID = idsAsInts.length > 0 ? Math.max(...idsAsInts) + 1 : 1;
    return `${lastUsedID}`;
  }
}