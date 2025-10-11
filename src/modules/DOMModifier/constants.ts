// constant.ts

// Множество ссылок, которые уже были обработаны
export var processedLinks = new WeakSet<Element>();

// Map для хранения скрытых блоков (контента аннотаций) с их идентификаторами
export var hiddenBlocks = new Map<string, string>();

// Множество блоков, которые уже были обработаны
export var processedBlocks = new WeakSet<Element>();

// Нужно ли менять отображение списков
export const needToAdjustLists = true;

// Нужно ли менять цвета для контрастности
export const needToAdjustColors = true;

export function clearProcessedData(): void {
  processedBlocks = new WeakSet<Element>();
  processedLinks = new WeakSet<Element>();
  hiddenBlocks = new Map<string, string>();
}

export function injectStyles(): void {
  console.log('Content script loaded successfully at', new Date().toISOString());

  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    a[data-styled="true"][data-icon="true"]::before {
      content: '★';
      display: inline-block;
      margin-right: 5px;
      vertical-align: middle;
      color: inherit;
      font-size: inherit;
    }
    a[data-styled="true"] {
      pointer-events: none !important;
      cursor: text !important;
    }
  `;

  document.head.appendChild(styleSheet);
}
