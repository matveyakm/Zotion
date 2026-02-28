import { textAttributes } from "./../panel";
import { applyHrefToSelection, generateHref, hrefLinkPrefix } from "../utils/hrefUtils";

export function setupApplyButtonListener(panelElement: HTMLElement, example: HTMLElement) {
    const applyBtn = panelElement.querySelector('#zot-apply-btn'); 
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
        applyHrefToSelection(generateHref(hrefLinkPrefix, textAttributes));
        });
    }
}