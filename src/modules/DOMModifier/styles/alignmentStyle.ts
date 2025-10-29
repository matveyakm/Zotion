// alignmentStyle.ts

export function applyAlignmentStyles(element: HTMLElement, textAlign: string | null, verticalAlign: string | null, index: number, linkId: string): void {
    console.log(`Applying alignment styles for link ${index + 1}, textAlign: ${textAlign}, verticalAlign: ${verticalAlign}`);
  
    let appliedTextAlign = 'left';
    if (textAlign) {
      const textAlignMap: { [key: string]: string } = {
        '0': 'left',
        '1': 'center',
        '2': 'right'
      };
      appliedTextAlign = textAlignMap[textAlign] || 'left';
      element.style.textAlign = appliedTextAlign;
    }
  
    let appliedVerticalAlign = 'top';
    if (verticalAlign) {
      const verticalAlignMap: { [key: string]: string } = {
        '0': 'top',
        '1': 'middle',
        '2': 'bottom'
      };
      appliedVerticalAlign = verticalAlignMap[verticalAlign] || 'top';
      element.style.verticalAlign = appliedVerticalAlign;
    }
  
    // Добавляем стиль через <style> с уникальным селектором
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      .notion-quote-block div:has(a[data-link-id="${linkId}"]),
      .notion-callout-block div:has(a[data-link-id="${linkId}"]) { 
        text-align: ${appliedTextAlign} !important; 
        vertical-align: ${appliedVerticalAlign} !important; 
      }`;
    document.head.appendChild(styleSheet);
  
    console.log(`Applied alignment styles for link ${index + 1}: textAlign=${appliedTextAlign}, verticalAlign=${appliedVerticalAlign}`);
}