import { textAttributes } from "../textPanel";
import { applyHrefToSelection, generateHrefFromTextAttributes } from "../../utils/hrefUtils";
import { switchAnnotationLState } from "./annotationSelect";


const needToLog = false;

// Устанавливает логику для кнопки применения стилей к блоку
// При клике генерирует href на основе текущих атрибутов блока и применяет его к выделенному блоку в Notion.
export function setupApplyButtonListener(panelElement: HTMLElement) {
    const applyBtn = panelElement.querySelector('#zot-apply-btn'); 
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            applyHrefToSelection(generateHrefFromTextAttributes(textAttributes));

            if (textAttributes.type === 1) {
                switchAnnotationLState(panelElement, false);
                textAttributes.type = 2;
            } else if (textAttributes.type === 2) {
                switchAnnotationLState(panelElement, true);
                textAttributes.type = 0;
            }
        });
    }
}

// Меняет цвет кнопки применения стилей к блоку в зависимости от того, можно ли применить стили к текущему выделению в Notion
export function switchApplyButtonState(panelElement: HTMLElement, isEnabled: boolean) {
    if (needToLog) console.log(`Switching apply button state to: ${isEnabled ? 'enabled' : 'disabled'}`);
    const applyBtn = panelElement.querySelector('#zot-apply-btn') as HTMLButtonElement | null;
    if (applyBtn) {
        if (isEnabled) {
            applyBtn.classList.remove('zot-apply-btn-cl-inactive');
        } else {
            applyBtn.classList.add('zot-apply-btn-cl-inactive');
        }
    }
}