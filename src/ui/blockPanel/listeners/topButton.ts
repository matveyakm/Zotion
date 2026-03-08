import { blockAttributes} from "../blockPanel"; 

// Устанавливает слушатели для всех "верхних" кнопок: горизонтальное и вертикальное выравнивание блока
export function setupTopButtonListener(panelElement: HTMLElement) {
    panelElement.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const btn = target.closest('.zot-top-button');
        if (!btn) return;
      
        e.stopPropagation();
      
        const key = btn.getAttribute('data-key');
        const valueRaw = btn.getAttribute('data-value');
        
        // Определение групп для взаимоисключения
        const isAlignment = btn.classList.contains('zot-alignment-button');
        const isVAlignment = btn.classList.contains('zot-v-alignment-button');
      
        if (isAlignment || isVAlignment) {
          const groupClass = isAlignment ? '.zot-alignment-button' : '.zot-v-alignment-button';
          const groupButtons = panelElement.querySelectorAll(groupClass);
      
          if (btn.classList.contains('zot-top-button-active')) {
            btn.classList.remove('zot-top-button-active');
          } else {
            groupButtons.forEach(b => b.classList.remove('zot-top-button-active'));
            btn.classList.add('zot-top-button-active');
          }
        } else {
          // Для кнопок без группы
          btn.classList.toggle('zot-top-button-active');
        }
      
        const isActive = btn.classList.contains('zot-top-button-active');
        
        if (key) {
          const allPreviews = panelElement.querySelectorAll('.zot-bp-example') as NodeListOf<HTMLElement>;
          const numericValue = valueRaw !== null ? parseInt(valueRaw, 10) : null;

          allPreviews.forEach(preview => {
            // Находим внутренний контейнер (div, blockquote / ячейку)
            const content = preview.querySelector('div, blockquote') as HTMLElement | null;
            if (!content) return;

            // Применяем визуальные стили к превью
            if (key === 'textAlign') {
              const alignMap: Record<number, string> = { 0: "left", 1: "center", 2: "right" };
              const styleVal = (isActive && numericValue !== null) ? alignMap[numericValue] : "left";
              
              content.style.textAlign = styleVal;
              // Для Callout (flex) выравниваем сам контент
              if (preview.id === 'zot-callout-example') {
                content.style.justifyContent = styleVal === "center" ? "center" : styleVal === "right" ? "flex-end" : "flex-start";
              }
            } 
            
            else if (key === 'verticalAlign') {
              const vAlignMap: Record<number, string> = { 0: "flex-start", 1: "center", 2: "flex-end" };
              content.style.display = "flex"; 
              content.style.flexDirection = "column";
              content.style.justifyContent = (isActive && numericValue !== null) ? vAlignMap[numericValue] : "flex-start";
              
              // используем нативное свойство
              if (preview.id === 'zot-table-example') {
                content.style.verticalAlign = (isActive && numericValue !== null) ? (numericValue === 1 ? "middle" : numericValue === 2 ? "bottom" : "top") : "top";
              }
            }
          });

          if (key === 'textAlign') blockAttributes.textAlign = isActive ? numericValue : null;
          if (key === 'verticalAlign') blockAttributes.verticalAlign = isActive ? numericValue : null;
        }
    });
}