import { blockAttributes } from "../blockPanel";
import { applyHrefToSelection, generateHrefFromBlockAttributes } from "../../utils/hrefUtils";

// Устанавливает логику для кнопки применения стилей к блоку
// При клике генерирует href на основе текущих атрибутов блока и применяет его к выделенному блоку в Notion.
export function setupApplyButtonListener(panelElement: HTMLElement) {
    const applyBtn = panelElement.querySelector('#zot-pb-apply-btn'); 
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            console.log(blockAttributes);
            applyHrefToSelection(generateHrefFromBlockAttributes(blockAttributes));

        });
    }
}