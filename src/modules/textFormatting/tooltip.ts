export function addTooltipListeners(link: HTMLAnchorElement, tooltip: HTMLDivElement, index: number): void {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(`Click prevented for annotation link ${index + 1}`);
    }, { capture: true });
  
    // Блокируем Notion-тултип через mouseover
    link.addEventListener('mouseover', (e) => {
      e.stopPropagation();
      console.log(`Mouseover prevented for link ${index + 1}`);
    }, { capture: true });
  
    link.addEventListener('mouseenter', (e) => {
      console.log(`Mouseenter triggered for link ${index + 1}, event:`, e);
  
      tooltip.style.display = 'block';
      tooltip.style.opacity = '0';
      tooltip.style.left = '-9999px';
      tooltip.style.top = '0px';
  
      requestAnimationFrame(() => {
        const rect = link.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
  
        let top = rect.bottom + scrollY + 8;
        let left = rect.left + scrollX;
  
        const spaceOnRight = viewportWidth - (rect.left + tooltipRect.width);
        if (spaceOnRight < 0) {
          left = rect.right + scrollX - tooltipRect.width;
        }
  
        const spaceBelow = window.innerHeight - rect.bottom;
        if (tooltipRect.height > spaceBelow - 8) {
          top = rect.top + scrollY - tooltipRect.height - 8;
        }
  
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.style.opacity = '1';
        console.log(`Tooltip positioned at left=${left}, top=${top} for link ${index + 1}`);
      });
    }, { capture: true });
  
    link.addEventListener('mouseleave', (e) => {
      console.log(`Mouseleave triggered for link ${index + 1}, event:`, e);
      tooltip.style.display = 'none';
      tooltip.style.opacity = '0';
      console.log(`Tooltip hidden for link ${index + 1}`);
    }, { capture: true });
  }