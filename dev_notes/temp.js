
console.log('Content script loaded successfully at', new Date().toISOString());


const styleSheet = document.createElement('style'); // Это надо?
styleSheet.textContent = `
    a[data-styled="true"][data-icon="true"]::before {
        content: '★'; /* Unicode-символ звезды */
        display: inline-block;
        margin-right: 5px;
        vertical-align: middle;
        color: inherit; /* Наследует цвет ссылки */
        font-size: inherit; /* Наследует размер шрифта */
    }
    a[data-styled="true"] {
        pointer-events: none !important;
        cursor: text !important;
    }
`;
document.head.appendChild(styleSheet);


// Utility function to debounce a callback
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Cache for processed links
const processedLinks = new WeakSet();

// Функция поиска стилизованных ссылок
function findStyledLinks(container = document) {
    console.log('Scanning for styled text links in container:', container);
    const links = container.querySelectorAll('.notion-text-block a[href*="#"]:not([data-styled]), .notion-text-block a[href^="//color=#"]:not([data-styled])');
    console.log(`Found ${links.length} unprocessed links with potential style format`);
    return Array.from(links);
}

// Функция обработки строки атрибутов
function parseLinkAttributes(href) {
    // Handle legacy color format: \\color=#xxxxxx
    const colorMatch = href.match(/\/\/color=#([0-9a-fA-F]{6})/);
    if (colorMatch) {
        return { legacyColor: colorMatch[1] };
    }

    // Handle new style format: #0.8.aaffff...#
    const styleMatch = href.match(/#([0-9a-fA-F.]+)#/);
    if (!styleMatch) return null;

    const attributes = styleMatch[1].split('.');
    return { attributes };
}

// Функция применения стилей к ссылке
function applyLinkStylesToText(link, parsedData, index) {
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

function applyLinkStylesToInfoBlock(link, parsedData, index) { // TO DO
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

// Функция для создания UI панели стилей
function createStylePanel() {
    const panel = document.createElement('div');
    panel.id = 'custom-style-panel';
    panel.style.position = 'absolute';
    panel.style.background = '#333';
    panel.style.color = '#fff';
    panel.style.padding = '10px';
    panel.style.borderRadius = '4px';
    panel.style.zIndex = '10000';
    panel.style.display = 'none';
    panel.style.width = '300px';
    panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    panel.innerHTML = `
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Type:</label>
            <select id="style-type" style="width: 100%;">
                <option value="0">Text</option>
                <option value="1">Info</option>
            </select>
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Font Size:</label>
            <select id="style-size" style="width: 100%;">
                <option value="8">Normal (16px)</option>
                ${[0,1,2,3,4,5,6,7,9,10,11,12,13,14,15].map(i => `<option value="${i}">${['Tiny (8px)', '9px', '10px', '11px', '12px', '13px', '14px', '15px', '18px', '20px', '24px', '28px', '32px', '40px', 'Huge (48px)'][i]}</option>`).join('')}
            </select>
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Text Color:</label>
            <input type="color" id="style-color-picker" style="width: 100%;">
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Background Color:</label>
            <input type="color" id="style-bgcolor-picker" style="width: 100%;">
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Text Decoration:</label>
            <select id="style-decoration" style="width: 100%;">
                <option value="0">None</option>
                <option value="1">Underline</option>
                <option value="2">Overline</option>
                <option value="3">Line-through</option>
                <option value="4">Underline + Overline</option>
            </select>
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Decoration Color:</label>
            <input type="color" id="style-decoration-color" style="width: 100%;">
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Font Style:</label>
            <select id="style-font-style" style="width: 100%;">
                <option value="0">Normal</option>
                <option value="1">Italic</option>
                <option value="2">Oblique</option>
            </select>
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Font Weight:</label>
            <select id="style-font-weight" style="width: 100%;">
                <option value="0">Normal</option>
                <option value="1">Bold</option>
                <option value="2">Lighter</option>
                <option value="3">Bolder</option>
            </select>
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Letter Spacing:</label>
            <input type="number" id="style-letter-spacing" min="0" max="15" style="width: 100%;" placeholder="Default (0px)">
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Word Spacing:</label>
            <input type="number" id="style-word-spacing" min="0" max="15" style="width: 100%;" placeholder="Default (0px)">
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">White Space:</label>
            <select id="style-white-space" style="width: 100%;">
                <option value="0">Normal</option>
                <option value="1">Nowrap</option>
                <option value="2">Pre</option>
            </select>
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Direction:</label>
            <select id="style-direction" style="width: 100%;">
                <option value="0">LTR</option>
                <option value="1">RTL</option>
            </select>
        </div>
        <div style="margin-bottom: 10px;">
            <label style="display: block; margin-bottom: 5px;">Vertical Align:</label>
            <select id="style-vertical-align" style="width: 100%;">
                <option value="0">Baseline</option>
                <option value="1">Sub</option>
                <option value="2">Super</option>
                <option value="3">Middle</option>
                <option value="4">Top</option>
                <option value="5">Bottom</option>
            </select>
        </div>
        <button id="style-apply" style="width: 100%; padding: 5px; background: #007bff; border: none; color: #fff; border-radius: 4px;">Apply</button>
    `;
    return panel;
}

// Основная функция для обработки выделения текста и UI
function setupStyleSelection() {
    let stylePanel = document.getElementById('custom-style-panel');
    if (!stylePanel) {
        stylePanel = createStylePanel();
        document.body.appendChild(stylePanel);
        console.log('Style panel created and appended');
    }

    let currentBlock = null;
    let currentRange = null;

    // Отслеживание выделения текста
    document.addEventListener('selectionchange', () => {
        console.log('Selection changed');
        const selection = window.getSelection();
        try {
            if (!selection || selection.rangeCount === 0 || !selection.toString() || selection.toString().trim() === '') {
                stylePanel.style.display = 'none';
                console.log('No valid selection or empty, hiding panel');
                return;
            }
        } catch (err) {
            console.error('Error checking selection:', err);
            stylePanel.style.display = 'none';
            return;
        }

        const range = selection.getRangeAt(0);
        const block = range.commonAncestorContainer.nodeType === 3
            ? range.commonAncestorContainer.parentElement.closest('.notion-text-block')
            : range.commonAncestorContainer.closest('.notion-text-block');
        if (block) {
            currentBlock = block;
            currentRange = range.cloneRange();
            const rect = block.getBoundingClientRect();
            stylePanel.style.top = `${rect.top + window.scrollY - stylePanel.offsetHeight - 10}px`;
            stylePanel.style.left = `${rect.left + window.scrollX}px`;
            stylePanel.style.display = 'block';
            console.log('Selection in notion-text-block, showing panel at:', rect.top, rect.left);
        } else {
            stylePanel.style.display = 'none';
            console.log('Selection outside notion-text-block, hiding panel');
        }
    });

    // Обработка клика по кнопке Apply
    const applyButton = stylePanel.querySelector('#style-apply');
    applyButton.addEventListener('click', () => {
        console.log('Apply button clicked');
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && currentBlock && currentRange) {
            try {
                selection.removeAllRanges();
                selection.addRange(currentRange);

                // Собираем атрибуты
                const type = stylePanel.querySelector('#style-type').value;
                const size = stylePanel.querySelector('#style-size').value;
                const color = stylePanel.querySelector('#style-color-picker').value.replace('#', '') || '';
                const bgColor = stylePanel.querySelector('#style-bgcolor-picker').value.replace('#', '') || '';
                const decoration = stylePanel.querySelector('#style-decoration').value;
                const decorationColor = stylePanel.querySelector('#style-decoration-color').value.replace('#', '') || '';
                const fontStyle = stylePanel.querySelector('#style-font-style').value;
                const fontWeight = stylePanel.querySelector('#style-font-weight').value;
                const letterSpacing = stylePanel.querySelector('#style-letter-spacing').value || '';
                const wordSpacing = stylePanel.querySelector('#style-word-spacing').value || '';
                const whiteSpace = stylePanel.querySelector('#style-white-space').value;
                const direction = stylePanel.querySelector('#style-direction').value;
                const verticalAlign = stylePanel.querySelector('#style-vertical-align').value;

                // Формируем строку атрибуты
                const attributes = [
                    type,
                    size,
                    color,
                    bgColor,
                    decoration,
                    decorationColor,
                    fontStyle,
                    fontWeight,
                    letterSpacing ? (parseInt(letterSpacing, 10) + 5).toString(16) : '',
                    wordSpacing ? (parseInt(wordSpacing, 10) + 5).toString(16) : '',
                    whitespace,
                    direction,
                    verticalAlign
                ];
                const href = `#${attributes.join('.')}#`;

                console.log('Creating styled link with href:', href);
                console.log('Creating styled link with href: ', href);
                const selectedText = currentRange.toString();
                if (selectedText) {
                    const link = document.createElement('a');
                    link.href = href;
                    link.className = 'notion-link-token';
                    link.setAttribute('data-styled', 'true');
                    link.innerHTML = `<span>${selectedText}</span>`;
                    currentRange.deleteContents();
                    currentRange.insertNode(link);
                    processTextStyleLinks(currentBlock); // Process only the affected block
                    console.log(`Created styled link: ${href}`);
                }
            } catch (err) {
                console.error('Error creating styled link:', err);
                // Запасной вариант с execCommand
                try {
                    document.execCommand('createLink', false, href);
                    const newLink = selection.anchorNode.parentElement.closest(`a[href*="${href}"]`);
                    if (newLink) {
                        newLink.className = 'notion-link-token';
                        newLink.setAttribute('data-styled', 'true');
                        const text = newLink.textContent;
                        newLink.innerHTML = `<span>${text}</span>`;
                        console.log('Link created with execCommand:', newLink);
                        processTextStyleLinks(currentBlock); // Process only the affected block
                    }
                } catch (err) {
                    console.error('Error with execCommand:', err);
                }
            }
        } else {
            console.log('No valid selection, block, or range for style link creation');
        }
        stylePanel.style.display = 'none';
        selection.removeAllRanges();
        console.log('Style panel hidden, selection cleared');
    });

    // Скрытие панели при клике вне её
    document.addEventListener('click', (e) => {
        if (!stylePanel.contains(e.target)) {
            stylePanel.style.display = 'none';
            console.log('Clicked outside, hiding style panel');
        }
    }, { capture: true });
}

// Запускаем обработку ссылок и UI после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing script');
    processTextStyleLinks();
    setupStyleSelection();
});

// Альтернативный запуск с увеличенной задержкой
setTimeout(() => {
    if (!document.getElementById('custom-style-panel')) {
        console.log('Fallback: Initializing script after delay');
        processTextStyleLinks();
        setupStyleSelection();
    }
}, 3000);

// Наблюдатель за изменениями в DOM с дебонсом
const debouncedProcessTextStyleLinks = debounce((mutations) => {
    console.log('DOM mutation detected, processing relevant changes');
    mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const oldValue = mutation.oldValue || '';
            const newValue = mutation.target.getAttribute('class') || '';
            if (oldValue.includes('notion-focusable-token') && newValue === 'notion-link-token') {
                console.log('Ignoring self-induced class change');
                return;
            }
        }
        const targetBlock = mutation.target.closest('.notion-text-block') || document;
        processTextStyleLinks(targetBlock);
    });
}, 2000);

const observer = new MutationObserver(debouncedProcessTextStyleLinks);
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'style', 'class'],
    attributeOldValue: true
});
console.log('MutationObserver initialized with debounce');

