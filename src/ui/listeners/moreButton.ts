import { textAttributes } from "./../panel";

export function setupMoreButtonListener(panelElement: HTMLElement, example: HTMLElement) {
  const toggleBtn = panelElement.querySelector('#zot-advanced-toggle');
  const content = panelElement.querySelector('#zot-advanced-content') as HTMLElement;

  if (toggleBtn && content) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = content.style.display === 'none' || content.style.display === '';
      
      content.style.display = isHidden ? 'flex' : 'none';
      toggleBtn.textContent = isHidden ? '▾ Дополнительно' : '▸ Дополнительно';
    });
  }
}