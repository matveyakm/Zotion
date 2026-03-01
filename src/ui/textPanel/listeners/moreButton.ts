import { textAttributes } from "../textPanel";

const needToLog = false;

export function setupMoreButtonListener(panelElement: HTMLElement, example: HTMLElement) {
    const toggleBtn = panelElement.querySelector('#zot-advanced-toggle');
    const content = panelElement.querySelector('#zot-advanced-content') as HTMLElement;

    if (toggleBtn && content) {
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = content.style.display === 'none' || content.style.display === '';
        
        content.style.display = isHidden ? 'flex' : 'none';
        toggleBtn.textContent = isHidden ? '▾  Дополнительно' : '▸  Дополнительно';
    });
    }

    // Логика для вертикального выравнивания
    const alignButtons = panelElement.querySelectorAll('.zot-vertical-align-btn');
    const activeClass = 'zot-vertical-align-btn-active';

    alignButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value');
        if (value !== null && !btn.classList.contains(activeClass)) {
            alignButtons.forEach(b => b.classList.remove(activeClass));
            btn.classList.add(activeClass);

            (textAttributes as any).verticalAlign = parseInt(value, 10);
            if (needToLog) console.log(`Vertical align updated to: ${value}`);
        }
    });
    });

    // Листенер для ползунка интервала между буквами
    const symbolSpacingSlider = panelElement.querySelector('#zot-symbol-spacing-slider') as HTMLInputElement;
    if (symbolSpacingSlider) {
        symbolSpacingSlider.addEventListener('input', () => {
            const value = parseInt(symbolSpacingSlider.value);
            
            (textAttributes as any).letterSpacing = value;
            
            if (needToLog) console.log(`letterSpacing set to: ${Math.round(value * 100)}%`);
        });
    }

    // Листенер для ползунка интервала между словами
    const wordSpacingSlider = panelElement.querySelector('#zot-word-spacing-slider') as HTMLInputElement;
    if (wordSpacingSlider) {
        wordSpacingSlider.addEventListener('input', () => {
            const value = parseInt(wordSpacingSlider.value);
            
            (textAttributes as any).wordSpacing = value;
            
            if (needToLog) console.log(`wordSpacing set to: ${Math.round(value * 100)}%`);
        });
    }

    // Листенер для ползунка интервала между строками
    const lineHeightSlider = panelElement.querySelector('#zot-line-height-slider') as HTMLInputElement;
    if (lineHeightSlider) {
        lineHeightSlider.addEventListener('input', () => {
            const value = parseInt(lineHeightSlider.value);
            
            (textAttributes as any).lineHeight = value;
            
            if (needToLog) console.log(`lineHeight set to: ${Math.round(value * 100)}%`);
        });
    }
}