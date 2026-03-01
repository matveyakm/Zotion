import { textAttributes } from "../textPanel";

export function setupAnnotationToggleListener(panelElement: HTMLElement) {
    const toggleBtn = panelElement.querySelector('#zot-toggle-annotation') as HTMLElement;
    const contentBlock = panelElement.querySelector('#zot-annotation-content') as HTMLElement;
    const iconPlus = panelElement.querySelector('#zot-icon-plus') as HTMLElement;
    const iconMinus = panelElement.querySelector('#zot-icon-minus') as HTMLElement;

    if (toggleBtn && contentBlock) {
        toggleBtn.addEventListener('click', () => {
            // Проверяем, развернут ли блок сейчас
            const isExpanded = contentBlock.style.display === 'flex';

            if (isExpanded) {
            // Сворачиваем
            contentBlock.style.display = 'none';
            iconPlus.style.display = 'block';
            iconMinus.style.display = 'none';
            } else {
            // Разворачиваем
            contentBlock.style.display = 'flex';
            iconPlus.style.display = 'none';
            iconMinus.style.display = 'block';
            }
        });
    }

    const annotationLinkBtn = panelElement.querySelector('#zot-annotation-link-btn') as HTMLElement;
    if (annotationLinkBtn) {
        annotationLinkBtn.addEventListener('click', () => {
            if (annotationLinkBtn.getAttribute('data-active') === 'do') {
                annotationLinkBtn.setAttribute('data-active', 'undo');
                annotationLinkBtn.textContent = 'Сделать обычным текстом';

                (textAttributes as any).type = 1;
            } else {
                annotationLinkBtn.setAttribute('data-active', 'do');
                annotationLinkBtn.textContent = 'Сделать ссылкой на аннотацию';

                (textAttributes as any).type = 0;
            }
        });
    }

    const annotationCancelBtn = panelElement.querySelector('#zot-annotation-cancel-btn') as HTMLElement;
    if (annotationCancelBtn) {
        annotationCancelBtn.addEventListener('click', () => {
            switchAnnotationLState(panelElement, true);
            (textAttributes as any).type = 0;
        });
    }
}

export function switchAnnotationLState(panelElement: HTMLElement, toButton: boolean) {
    const annotationLinkBtn = panelElement.querySelector('#zot-annotation-link-btn') as HTMLElement;
    const annotationContentText = panelElement.querySelector('#zot-annotation-content-text') as HTMLElement;
    if (annotationLinkBtn && annotationContentText) {
        if (toButton) {
            annotationLinkBtn.setAttribute('data-active', 'do');
            annotationLinkBtn.textContent = 'Сделать ссылкой на аннотацию';
            annotationLinkBtn.style.display = 'block';

            annotationContentText.style.display = 'none';
        } else {
            annotationLinkBtn.style.display = 'none';

            annotationContentText.style.display = 'flex';
        }
    }
}