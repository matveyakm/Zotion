// scanner.ts

import { parseLinkAttributes } from './parser';
import { applyLinkStylesToText, applyTooltipStyles } from './style';
import { processedLinks, hiddenBlocks } from './constants';

export function findStyledLinks(container: ParentNode = document): HTMLAnchorElement[] {
  const links = container.querySelectorAll<HTMLAnchorElement>(
    '.notion-text-block a[href*="#"]:not([data-styled]), .notion-text-block a[href^="//color=#"]:not([data-styled])'
  );
  return Array.from(links);
}

export function processTextStyleLinks(container: ParentNode = document): void {
  const links = findStyledLinks(container);

  const isDarkTheme = document.body.classList.contains('dark') || document.querySelector('.notion-dark-theme') !== null;

  console.log('Detected theme: ', isDarkTheme ? 'Dark' : 'Light');

  // Слушатель для скрытия тултипов при потере фокуса вкладки
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      document.querySelectorAll<HTMLDivElement>('.annotation-tooltip').forEach(tooltip => {
        tooltip.style.display = 'none';
        tooltip.style.opacity = '0';
        console.log('All tooltips hidden due to visibilitychange');
      });
    }
  }, { once: false });

  // Слушатель для скрытия тултипов при изменении размера окна
  window.addEventListener('resize', () => {
    document.querySelectorAll<HTMLDivElement>('.annotation-tooltip').forEach(tooltip => {
      tooltip.style.display = 'none';
      tooltip.style.opacity = '0';
      console.log('All tooltips hidden due to window resize');
    });
  }, { passive: true });

  // Первый проход для скрытия блоков и применения стилей
  links.forEach((link, index) => {
    if (processedLinks.has(link)) return;

    const href = link.getAttribute('href');
    if (!href) return;

    const parsedData = parseLinkAttributes(href);
    if (!parsedData || ('attributes' in parsedData && !parsedData.attributes)) return;

    if(parsedData.attributes && parsedData.attributes[0] == "1") return;

    processedLinks.add(link);

    if (!('attributes' in parsedData)) return;
    
    applyLinkStylesToText(link, parsedData, index);

    // Обработка контента аннотаций
    if (parsedData.attributes[0] == "2") {
      if (!parsedData.attributes[13]) {
        console.warn(`Format of attributes is not correct for link ${index + 1}`);
        return;
      }

      const blockId = parsedData.attributes[13];
      if (!blockId) {
        console.warn(`Cant found blockID for link ${index + 1}`);
        return;
      }

      const block = link.closest('[data-block-id]') as HTMLElement | null;
      if (!block) {
        console.warn(`No block with data-block-id found for link ${index + 1}`);
        return;
      }
        
      hiddenBlocks.set(blockId, block.outerHTML);
      block.style.display = 'none';
      console.log(`Hidden block with data-block-id=${block.getAttribute('data-block-id')} and saved with key=${blockId} for link ${index + 1}`);
    }
  });

  // Второй проход для аннотаций, чтобы порядок был не важен
  links.forEach((link, index) => {
    if (processedLinks.has(link)) return;

    const href = link.getAttribute('href');
    if (!href) return;

    const parsedData = parseLinkAttributes(href);
    if (!parsedData || ('attributes' in parsedData && !parsedData.attributes)) return;

    processedLinks.add(link);

    if (!('attributes' in parsedData)) return;
    
    applyLinkStylesToText(link, parsedData, index);

    // Обработка аннотации-ссылки
    if (parsedData.attributes[0] === "1") {
      const blockId = parsedData.attributes[13];
      console.log(`Checking annotation for link ${index + 1}, blockId=${blockId}, hiddenBlocks keys=${Array.from(hiddenBlocks.keys())}`);
      if (blockId && hiddenBlocks.has(blockId)) {
        const tooltip = document.createElement('div');
        tooltip.className = 'annotation-tooltip';
        tooltip.innerHTML = hiddenBlocks.get(blockId) || '';

        // Добавляем иконку "X" для закрытия
        const closeButton = document.createElement('span');
        closeButton.innerHTML = '×';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '2px';
        closeButton.style.right = '2px';
        closeButton.style.fontSize = '12px';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.color = isDarkTheme ? '#A4A4A4' : '#222222';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '2px 4px';
        closeButton.style.lineHeight = '1';
        closeButton.addEventListener('click', (e) => {
          e.stopPropagation();
          tooltip.style.display = 'none';
          tooltip.style.opacity = '0';
          console.log(`Tooltip closed via X button for link ${index + 1}`);
        });
        tooltip.appendChild(closeButton);
        
        const parentBlock = link.closest('.notion-text-block') as HTMLElement | null;;
        applyTooltipStyles(tooltip, parentBlock); 
        document.body.appendChild(tooltip);

        console.log(`Adding mouseenter/mouseleave listeners for link ${index + 1}, link element:`, link);
        link.style.pointerEvents = 'auto';
        
        console.log(`Adding mouseenter/mouseleave listeners for link ${index + 1}`);
        const addListeners = () => {
          link.addEventListener('click', (e) => {
            e.preventDefault(); // Блокируем переход по href
            e.stopPropagation(); // Останавливаем всплытие для Notion
            console.log(`Click prevented for annotation link ${index + 1}`);
          }, { capture: true });

          // Блокируем Notion-тултип через mouseover
          link.addEventListener('mouseover', (e) => {
            e.stopPropagation();
            console.log(`Mouseover prevented for link ${index + 1}`);
          }, { capture: true });

          link.addEventListener('mouseenter', (e) => {
            console.log(`Mouseenter triggered for link ${index + 1}, event:`, e);
            
            // Показываем тултип off-screen для расчёта ширины
            tooltip.style.display = 'block';
            tooltip.style.opacity = '0'; 
            tooltip.style.left = '-9999px'; // Off-screen
            tooltip.style.top = '0px'; // Временная позиция
            
            // Ждём tick для рендера ширины (offsetWidth)
            requestAnimationFrame(() => {
              const rect = link.getBoundingClientRect();
              const tooltipRect = tooltip.getBoundingClientRect();
              const viewportWidth = window.innerWidth;
              const scrollX = window.scrollX;
              const scrollY = window.scrollY;
              
              // Базовая позиция снизу от ссылки
              let top = rect.bottom + scrollY + 8;
              let left = rect.left + scrollX;
              
              // Проверяем переполнение по ширине: если тултип вылазит за правый край viewport
              const spaceOnRight = viewportWidth - (rect.left + tooltipRect.width);
              if (spaceOnRight < 0) { // Или < отступ, напр. 10px: spaceOnRight < 10
                left = rect.right + scrollX - tooltipRect.width; // Прикрепляем к правому краю ссылки
              }
              
              // Опционально: проверка по высоте (если тултип длинный, ставим сверху)
              const spaceBelow = window.innerHeight - rect.bottom;
              if (tooltipRect.height > spaceBelow - 8) {
                top = rect.top + scrollY - tooltipRect.height - 8;
              }
              
              // Применяем позицию
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
        };
  
        addListeners();
        console.log(`Added annotation tooltip for link ${index + 1} with blockId=${blockId}`);
      } else {
        console.warn(`No hidden block found for blockId=${blockId} or missing attributes[13] for link ${index + 1}`);
      }
    }
  });
}