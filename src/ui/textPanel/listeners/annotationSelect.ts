import { textAttributes } from "../textPanel";

// Устанавливает логику для кнопки разворачивания блока аннотации и для кнопки переключения между обычным текстом и ссылкой на аннотацию внутри этого блока
export function setupAnnotationToggleListener(panelElement: HTMLElement) {
    const toggleBtn = panelElement.querySelector('#zot-toggle-annotation') as HTMLElement;
    const contentBlock = panelElement.querySelector('#zot-annotation-content') as HTMLElement;
    const iconPlus = panelElement.querySelector('#zot-icon-plus') as HTMLElement;
    const iconMinus = panelElement.querySelector('#zot-icon-minus') as HTMLElement;

    // Разворачивание или сворачивание
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

    // Логика для кнопки переключения между обычным текстом и ссылкой на аннотацию внутри блока
    const annotationLinkBtn = panelElement.querySelector('#zot-annotation-link-btn') as HTMLElement;
    if (annotationLinkBtn) {
        annotationLinkBtn.addEventListener('click', () => {
            if (annotationLinkBtn.getAttribute('data-active') === 'do') {
                annotationLinkBtn.setAttribute('data-active', 'undo');
                annotationLinkBtn.textContent = 'Сделать обычным текстом';

                textAttributes.type = 1; // Ссылка на аннотацию
            } else {
                annotationLinkBtn.setAttribute('data-active', 'do');
                annotationLinkBtn.textContent = 'Сделать ссылкой на аннотацию';

                textAttributes.type = 0; // Текст
            }
        });
    }

    // Логика для кнопки отмены: пользователь не хочет добавлять к созданной ссылке на аннотацию её контент
    const annotationCancelBtn = panelElement.querySelector('#zot-annotation-cancel-btn') as HTMLElement;
    if (annotationCancelBtn) {
        annotationCancelBtn.addEventListener('click', () => {
            switchAnnotationLState(panelElement, true);
            textAttributes.type = 0; // Текст
        });
    }
}

// Переключает видимость кнопки превращения текста в ссылку на аннотацию и самого контента аннотации внутри блока
// в зависимости от параметра toButton:
//      -- true - показывать кнопку создания ссылки на аннотацию
//      -- false - показывать информацию, что сейчас пользователь выбирает контент для созданной только что ссылки на аннотацию
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