import { BlockAttributes } from "../blockPanel";
import { changeVisibilityOfTabs } from "./colorPicker";

export function setupTypeSelectionListener(panelElement: HTMLElement) {
  const typeSelect = panelElement.querySelector('#zot-block-type-select') as HTMLSelectElement | null;
  const HIDDEN_CLASS = 'zot-bp-hidden';

  const blockTypeMap: Record<string, { id: number, viewClass: string }> = {
    "Callout":    { id: 0, viewClass: 'zot-callout-view' },
    "Quote":      { id: 1, viewClass: 'zot-quote-view' },
    "Table Cell": { id: 2, viewClass: 'zot-table-view' },
    "Divider":    { id: 3, viewClass: 'zot-divider-view' }
  };

  if (typeSelect) {
    typeSelect.addEventListener('change', () => {
      const selectedValue = typeSelect.value;
      const config = blockTypeMap[selectedValue];

      if (!config) return;

      (BlockAttributes as any).type = config.id;

      const allViewElements = panelElement.querySelectorAll(
        '.zot-callout-view, .zot-quote-view, .zot-table-view, .zot-divider-view, .zot-textable-block-view'
      );
      const widthSelect = panelElement.querySelector('#zot-border-size-select') as HTMLSelectElement | null;

      allViewElements.forEach(el => {
        const isDivider = selectedValue === "Divider";
        
        // Логика для zot-textable-block-view (скрыть только если Divider)
        if (el.classList.contains('zot-textable-block-view')) {
          el.classList.toggle(HIDDEN_CLASS, isDivider);
          return;
        }

        if (widthSelect) {
            widthSelect.style.width = isDivider ? '215px' : '69px';
        }

        changeVisibilityOfTabs(panelElement, isDivider);

        const shouldBeVisible = el.classList.contains(config.viewClass);
        el.classList.toggle(HIDDEN_CLASS, !shouldBeVisible);
      });

      console.log(`Switched to ${selectedValue}, Type ID: ${config.id}`);
    });
  }
}