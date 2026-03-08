export let isAdvancedShown = false;

// Логика скрытия/раскрытия вкладки со статистикой
export function setupStatsListener(panelElement: HTMLElement) {
    const toggleBtn = panelElement.querySelector('#zot-timer-advanced-toggle');
    const content = panelElement.querySelector('#zot-timer-advanced-content') as HTMLElement;
    if (toggleBtn && content) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = content.style.display === 'none' || content.style.display === '';
            
            content.style.display = isHidden ? 'flex' : 'none';
            toggleBtn.textContent = isHidden ? '▾  Дополнительно' : '▸  Дополнительно';
            isAdvancedShown = isHidden;
        });
    }
}