import { textAttributes } from "../textPanel";
import { applyHrefToSelection, generateHref, hrefLinkPrefix } from "../../utils/hrefUtils";

const needToLog = false;

export function setupApplyButtonListener(panelElement: HTMLElement, example: HTMLElement) {
    const applyBtn = panelElement.querySelector('#zot-apply-btn'); 
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
        applyHrefToSelection(generateHref(hrefLinkPrefix, textAttributes));
        });
    }
}

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