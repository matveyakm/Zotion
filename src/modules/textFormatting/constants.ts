// constant.ts

export const processedLinks = new WeakSet<Element>();
export const hiddenBlocks = new Map<string, string>();

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
