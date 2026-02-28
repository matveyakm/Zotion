import { TextAttributes } from "../panel";

export const hrefLinkPrefix = "https://example.com/";

export function applyHrefToSelection(href: string) {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      console.log('Panel: Нет выделенного текста');
      return;
    }
  
    const range = selection.getRangeAt(0);
    const editable = range.commonAncestorContainer.parentElement?.closest('[contenteditable="true"]') as HTMLElement | null;
    if (!editable) {
      console.log('Panel: Не найден contenteditable');
      return;
    }
  
    const existingA = range.startContainer.parentElement?.closest('a[href*="example.com"]');
    if (existingA) {
      console.log('Panel: Снимаем существующую ссылку');
      document.execCommand('unlink', false);
      return;
    }
  
    console.log('Panel: Начинаю эмуляцию Ctrl+K для создания ссылки с href:', href);
  
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
        console.warn('Panel: Input popup не найден');
        return;
      }
  
      console.log('Panel: Нашли input popup, начинаем посимвольный ввод URL');
  
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
    
            console.log('Panel: Ввод URL завершён, Enter отправлен');
          }, 10)
        }
      }, 3);
    }, 10);
}

export function generateHref(hrefLinkPrefix : string, textAttributes: TextAttributes) : string {
    const objectType = 0; // text
    let href = hrefLinkPrefix + [ 
        objectType, // 0
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
    ].join('.') + "#";
    console.log('Generated href:', href);
    return href;
}