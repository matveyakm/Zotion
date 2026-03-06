import { blockAttributes } from "../blockPanel";

export function setupSelectListeners(panelElement: HTMLElement) {
  const borderSelect = panelElement.querySelector('#zot-border-size-select') as HTMLSelectElement | null;
  const radiusSelect = panelElement.querySelector('#zot-radius-size-select') as HTMLSelectElement | null;

  // borderWidth selector
  borderSelect?.addEventListener('change', () => {
    const val = borderSelect.value;
    const numericVal = val === "Auto" ? null : parseInt(val, 10);
    
    blockAttributes.borderWidth = numericVal;

    const allPreviews = panelElement.querySelectorAll('.zot-bp-example');
    allPreviews.forEach(preview => {
      const content = preview.querySelector('div, blockquote, [role="separator"]') as HTMLElement | null;
      if (!content) return;

      const px = numericVal !== null ? `${numericVal}px` : '';

      if (preview.id === 'zot-divider-example') {
        // Для Divider меняем высоту линии (толщину)
        const lines = preview.querySelectorAll('[role="separator"]');
        lines.forEach(line => (line as HTMLElement).style.height = px || '1px');
      } else if (preview.id === 'zot-quote-example') {
        // Для Quote меняем только левую границу
        content.style.borderLeftWidth = px || '3px';
      } else {
        // Для Callout и Table Cell меняем всю границу
        content.style.borderWidth = px || '1px';
        content.style.padding = `${Math.max(12 - (numericVal || 0), 0)}px 20px` 
      }
    });
  });

  // radius selector
  radiusSelect?.addEventListener('change', () => {
    const val = radiusSelect.value;
    const numericVal = val === "Auto" ? null : parseInt(val, 10);

    blockAttributes.radius = numericVal;

    // только к Callout
    const callout = panelElement.querySelector('#zot-callout-example div') as HTMLElement | null;
    if (callout) {
      callout.style.borderRadius = numericVal !== null ? `${numericVal}px` : '10px';
    }
  });
}