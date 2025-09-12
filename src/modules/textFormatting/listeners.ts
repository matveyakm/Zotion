export function setupGlobalListeners(): void {
    // Скрытие всех тултипов при смене видимости страницы
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        document.querySelectorAll<HTMLDivElement>('.annotation-tooltip').forEach(tooltip => {
          tooltip.style.display = 'none';
          tooltip.style.opacity = '0';
          console.log('All tooltips hidden due to visibilitychange');
        });
      }
    }, { once: false });
    
    // Скрытие всех тултипов при изменении размера окна
    window.addEventListener('resize', () => {
      document.querySelectorAll<HTMLDivElement>('.annotation-tooltip').forEach(tooltip => {
        tooltip.style.display = 'none';
        tooltip.style.opacity = '0';
        console.log('All tooltips hidden due to window resize');
      });
    }, { passive: true });
  }