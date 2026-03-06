import { blockAttributes } from "../blockPanel";
import { applyHrefToSelection, generateHrefFromBlockAttributes } from "../../utils/hrefUtils";

const needToLog = false;

export function setupApplyButtonListener(panelElement: HTMLElement) {
    const applyBtn = panelElement.querySelector('#zot-pb-apply-btn'); 
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            applyHrefToSelection(generateHrefFromBlockAttributes(blockAttributes));

        });
    }
}