import { annotationIDs } from "../../modules/DOMModifier/constants";
import { textAttributes, TextAttributes } from "../textPanel/textPanel";
import { BlockAttributes } from "../blockPanel/blockPanel";

const needToLog = false;

export const hrefLinkPrefix = "https://example.com/";

let lastUsedID: number | null = null;

// Применяет к выделенному тексту заданный href путём эмуляции действий пользователя для обхода запретов Notion
// TODO: иногда ссылка устанавливается на текущую открытую страницу Notion, а не то, что приняла функция
// TODO: isItABlock: boolean = false
export function applyHrefToSelection(href: string) {
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

// Генерация href для текста по данным атрибутам в виде, описанном в Wiki репозитория
export function generateHrefFromTextAttributes(textAttributes: TextAttributes) : string {
    const href = hrefLinkPrefix + "#" + [ 
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

// Получения нового ID для связи аннотации
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

// Генерация href для блоков по данным атрибутам в виде, описанном в Wiki репозитория
export function generateHrefFromBlockAttributes(blockAttributes : BlockAttributes) {
  let href = '';
    if (blockAttributes.type === 3) { // если это Divider
      href = hrefLinkPrefix + "#" + [ 
        '3', // 0
        blockAttributes.borderWidth ? `${blockAttributes.borderWidth.toString(16)}` : '', // 1
        blockAttributes.borderColor ? `${blockAttributes.borderColor}` : '', // 2
        '', // 3
        '', // 4
        '', // 5
        '', // 6
        '', // 7
        '', // 8
        '', // 9
        '', // 10
        '', // 11
        '', // 12
      ].join('.') + "#";
    } else { // если это quote, callout, tablecell
      href = hrefLinkPrefix + "#" + [ 
        '3', // 0
        blockAttributes.radius ? `${blockAttributes.radius.toString(16)}` : '', // 1
        blockAttributes.backgroundColor ? `${blockAttributes.backgroundColor}` : '', // 2
        blockAttributes.borderWidth ? `${blockAttributes.borderWidth.toString(16)}` : '', // 3
        blockAttributes.borderColor ? `${blockAttributes.borderColor}` : '', // 4
        '', // 5
        '', // 6
        '', // 7
        '', // 8
        '', // 9
        '', // 10
        blockAttributes.textAlign ? `${blockAttributes.textAlign}` : '', // 11
        blockAttributes.verticalAlign ? `${blockAttributes.verticalAlign}` : '', // 12
      ].join('.') + "#";
    }
    
    if (needToLog) console.log('Generated href for block:', href);
    return href;
}