import { textAttributes } from "../textPanel";

const needToLog = false;

export function setupTopButtonListener(panelElement: HTMLElement, example: HTMLElement) {
    panelElement.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const btn = target.closest('.zot-top-button');
        if (!btn) return;
      
        e.stopPropagation();
      
        const group = btn.closest('.zot-decoration-btn, .zot-alignment-button') 
          ? btn.classList.contains('zot-decoration-btn') ? 'decoration' : 'alignment'
          : null;
      
        // Если кнопка в группе (decoration или alignment)
        if (group) {
          const groupButtons = panelElement.querySelectorAll(
            group === 'decoration' ? '.zot-decoration-btn' : '.zot-alignment-button'
          );
      
          // Если уже активна — снимаем
          if (btn.classList.contains('zot-top-button-active')) {
            btn.classList.remove('zot-top-button-active');
          } else {
            groupButtons.forEach(b => b.classList.remove('zot-top-button-active'));
            btn.classList.add('zot-top-button-active');
          }
          
          if (needToLog) {
            console.log(`${group} group updated:`, Array.from(groupButtons).map(b => ({
              id: b.id,
              active: b.classList.contains('zot-top-button-active')
            })));
          }
        } else {
          // Обычная кнопка (не в группе) — просто toggle
          btn.classList.toggle('zot-top-button-active');
          if (needToLog) console.log('Обычная кнопка toggled:', btn.id, btn.classList.contains('zot-top-button-active'));
        }
      
        // Обновление textAttributes (для всех кнопок с data-key)
        const key = btn.getAttribute('data-key');
        const value = btn.getAttribute('data-value');
        const isActive = btn.classList.contains('zot-top-button-active');
        
        if (key) {
          if (key == 'fontWeight') {
            example.style.fontWeight = isActive ? "bold" : 'normal';
            if (needToLog) console.log('Updated example fontWeight');
          } else if (key === 'fontStyle') {
            example.style.fontStyle = isActive ? "italic" : 'normal';
          } else if (key === 'decoration') {
            const decorationValue = parseInt(value || '0', 10);
            if (isActive && !isNaN(decorationValue) && decorationValue > 0 && decorationValue <= 4) {
              if (decorationValue === 1) {
                example.style.textDecoration = 'underline';
              } else if (decorationValue === 2) {
                example.style.textDecoration = 'overline';
              } else if (decorationValue === 3) {
                example.style.textDecoration = 'line-through';
              } else if (decorationValue === 4) {
                example.style.textDecoration = 'underline overline';
              }
            } else {
              example.style.textDecoration = 'none';
            }
          } else if (key === 'textAlign') {
            const alignmentValue = parseInt(value || '0', 10);
            if (isActive && !isNaN(alignmentValue) && alignmentValue >= 0 && alignmentValue <= 2) {
              if (alignmentValue === 0) {
                example.style.textAlign = 'left';
              } else if (alignmentValue === 1) {
                example.style.textAlign = 'center';
              } else if (alignmentValue === 2) {
                example.style.textAlign = 'right';
              }
            } else {
              example.style.textAlign = 'center';
            }
            if (needToLog) console.log('Updated example textAlign', example.style.textAlign);
          }
    
          textAttributes[key as keyof typeof textAttributes] = isActive ? value : null;
          if (needToLog) console.log('Обновлено textAttributes:', textAttributes);
        }
      });
}