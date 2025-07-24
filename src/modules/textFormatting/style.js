import { processedLinks } from './constants.js';

export function applyLinkStylesToText(link, parsedData, index) {
    processedLinks.add(link);
    link.setAttribute('data-styled', 'true'); // Mark as processed
    console.log(`Processing link ${index + 1}`);

    // Default styles
    link.style.textDecoration = 'none';
    link.style.cursor = 'text';
    link.style.pointerEvents = 'none'; // Отключаем события мыши
    link.removeAttribute('tabindex'); // Удаляем фокусировку
    link.classList.remove('notion-focusable-token', 'notion-enable-hover');

    // Добавляем иконку через ::before
    link.style.position = 'relative'; // Для позиционирования иконки
    link.setAttribute('data-icon', 'true'); // Маркер для CSS

    const span = link.querySelector('span');
    if (span) {
        span.style.borderBottom = 'none';
        span.style.opacity = '1';
    }

    if (parsedData.legacyColor) {
        console.log(`Applying legacy color: #${parsedData.legacyColor}`);
        link.style.color = `#${parsedData.legacyColor}`;
        console.log(`Processed legacy color link ${index + 1}`);
        return;
    }

    const attributes = parsedData.attributes;
    if (!attributes) return;

    console.log(`Applying styles for link ${index + 1} with attributes:`, attributes);

    // [1] size: 0=tiny ... 8=normal ... F=huge
    if (attributes[1]) {
        const size = parseInt(attributes[1], 16);
        const fontSizes = [
            '8px', '9px', '10px', '11px', '12px', '13px', '14px', '15px',
            '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px'
        ];
        link.style.fontSize = fontSizes[size] || '16px';
    }

    // [2] color: XXXXXX=#xxxxxx
    if (attributes[2]) {
        const color = attributes[2].match(/[0-9a-fA-F]{6}/)?.[0];
        if (color) link.style.color = `#${color}`;
    }

    // [3] backgroundColor: #xxxxxx
    if (attributes[3]) {
        const bgColor = attributes[3].match(/[0-9a-fA-F]{6}/)?.[0];
        if (bgColor) link.style.backgroundColor = `#${bgColor}`;
    }

    // [4] textDecoration: 0=none, 1=underline, 2=overline, 3=line-through, 4=underline+overline
    if (attributes[4]) {
        const dec = parseInt(attributes[4], 16);
        const decorations = [
            'none', 'underline', 'overline', 'line-through', 'underline overline'
        ];
        link.style.textDecoration = decorations[dec] || 'none';
    }

    // [5] textDecorationColor: #xxxxxx
    if (attributes[5]) {
        const decColor = attributes[5].match(/[0-9a-fA-F]{6}/)?.[0];
        if (decColor) link.style.textDecorationColor = `#${decColor}`;
    }

    // [6] fontStyle: 0=normal, 1=italic, 2=oblique
    if (attributes[6]) {
        const style = parseInt(attributes[6], 16);
        const styles = ['normal', 'italic', 'oblique'];
        link.style.fontStyle = styles[style] || 'normal';
    }

    // [7] fontWeight: 0=normal, 1=bold, 2=lighter, 3=bolder
    if (attributes[7]) {
        const weight = parseInt(attributes[7], 16);
        const weights = ['normal', 'bold', 'lighter', 'bolder'];
        link.style.fontWeight = weights[weight] || 'normal';
    }

    // [8] letterSpacing: n=(n-5)px
    if (attributes[8]) {
        const spacing = parseInt(attributes[8], 16);
        link.style.letterSpacing = `${spacing - 5}px`;
    }

    // [9] wordSpacing: n=(n-5)px
    if (attributes[9]) {
        const spacing = parseInt(attributes[9], 16);
        link.style.wordSpacing = `${spacing - 5}px`;
    }

    // [10] whiteSpace: 0=normal, 1=nowrap, 2=pre
    if (attributes[10]) {
        const ws = parseInt(attributes[10], 16);
        const spaces = ['normal', 'nowrap', 'pre'];
        link.style.whiteSpace = spaces[ws] || 'normal';
    }

    // [11] direction: 0=ltr, 1=rtl
    if (attributes[11]) {
        const dir = parseInt(attributes[11], 16);
        link.style.direction = dir === 1 ? 'rtl' : 'ltr';
    }

    // [12] verticalAlign: 0=baseline, 1=sub, 2=super, 3=middle, 4=top, 5=bottom
    if (attributes[12]) {
        const va = parseInt(attributes[12], 16);
        const aligns = ['baseline', 'sub', 'super', 'middle', 'top', 'bottom'];
        link.style.verticalAlign = aligns[va] || 'baseline';
    }

    console.log(`Processed styled link ${index + 1} with styles applied`);
    
}

export function applyLinkStylesToInfoBlock(link, parsedData, index) {
    if (processedLinks.has(link)) {
        console.log(`Link ${index + 1} already processed, skipping`);
        return;
    }
    processedLinks.add(link);
    link.setAttribute('data-styled', 'true');
    const originalHref = link.href;
    link.dataset.originalHref = originalHref;
    console.log(`Processing link ${index + 1}, href: ${originalHref}, original text: ${link.textContent}`);
  
    // Находим span с классом, начинающимся на link-annotation
    let emojiSpan = link.querySelector('span[class*="link-annotation"]');
    if (!emojiSpan) {
        console.log(`No link-annotation span found in link ${index + 1}, creating new`);
        emojiSpan = document.createElement('span');
        emojiSpan.className = `emoji-container link-annotation-${link.closest('[data-block-id]')?.getAttribute('data-block-id') || 'unknown'}-${index}`;
        link.innerHTML = ''; // Очищаем содержимое ссылки
        link.appendChild(emojiSpan);
    } else {
        console.log(`Found existing span in link ${index + 1}:`, emojiSpan.outerHTML);
        emojiSpan.classList.add('emoji-container');
    }
  
    // Устанавливаем эмодзи и стили
    emojiSpan.textContent = 'ℹ️';
    emojiSpan.style.display = 'inline-block';
    emojiSpan.style.position = 'relative';
    emojiSpan.style.width = '24px';
    emojiSpan.style.height = '24px';
    emojiSpan.style.lineHeight = '24px';
    emojiSpan.style.verticalAlign = 'middle';
    emojiSpan.style.opacity = '0.7';
    emojiSpan.style.fontSize = '0';
    console.log(`Set emoji and styles for span in link ${index + 1}:`, emojiSpan.outerHTML);
  
    // Проверяем href
    if (link.href !== originalHref) {
        link.href = originalHref;
        console.log(`Restored href for link ${index + 1}: ${link.href}`);
    }
  
    // Применяем стили из parsedData
    if (parsedData.legacyColor) {
        link.style.color = `#${parsedData.legacyColor}`;
        console.log(`Applied legacy color #${parsedData.legacyColor} to link ${index + 1}`);
        return;
    }
  
    const attributes = parsedData.attributes;
    if (!attributes) {
        console.log(`No attributes in parsedData for link ${index + 1}`);
        return;
    }
  
    // [1] size
    if (attributes[1]) {
        const size = parseInt(attributes[1], 16);
        const fontSizes = [
            '8px', '9px', '10px', '11px', '12px', '13px', '14px', '15px',
            '16px', '18px', '20px', '24px', '28px', '32px', '40px', '48px'
        ];
        const iconSize = fontSizes[size] || '24px';
        emojiSpan.style.width = iconSize;
        emojiSpan.style.height = iconSize;
        console.log(`Set size ${iconSize} for link ${index + 1}`);
    }
  
    // [2] color
    if (attributes[2]) {
        const color = attributes[2].match(/[0-9a-fA-F]{6}/)?.[0];
        if (color) {
            link.style.color = `#${color}`;
            console.log(`Set color #${color} for link ${index + 1}`);
        }
    }
  
    // [3] backgroundColor
    if (attributes[3]) {
        const bgColor = attributes[3].match(/[0-9a-fA-F]{6}/)?.[0];
        if (bgColor) {
            link.style.backgroundColor = `#${bgColor}`;
            console.log(`Set background color #${bgColor} for link ${index + 1}`);
        }
    }
  
    console.log(`Finished processing link ${index + 1}, final HTML:`, link.outerHTML);
  }
  
  // Новая функция обработки ссылок, использующая разделенные функции
  function processTextStyleLinks(container = document) {
    const links = findStyledLinks(container);
    links.forEach((link, index) => {
        if (processedLinks.has(link)) {
            console.log(`Skipping already processed link ${index + 1}`);
            return;
        }
        const href = link.getAttribute('href');
        const parsedData = parseLinkAttributes(href);
        if (parsedData) {
            if (parsedData.attributes && parsedData.attributes[0] && parsedData.attributes[0] == "1") {
              applyLinkStylesToInfoBlock(link, parsedData, index);
            } else if (!parsedData.attributes || (parsedData.attributes[0] && parsedData.attributes[0] == "0")) {
              applyLinkStylesToText(link, parsedData, index);
            }
        }
    });
}
