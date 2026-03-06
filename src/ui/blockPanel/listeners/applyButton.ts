import { blockAttributes } from "../blockPanel";
import { applyHrefToSelection, generateHrefFromBlockAttributes } from "../../utils/hrefUtils";

export function setupApplyButtonListener(panelElement: HTMLElement) {
    const applyBtn = panelElement.querySelector('#zot-pb-apply-btn'); 
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            console.log(blockAttributes);
            applyHrefToSelection(generateHrefFromBlockAttributes(blockAttributes));

        });
    }
}