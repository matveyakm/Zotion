import { initTextPanel } from "./textPanel/textPanel";
import { initMainPanel } from "./mainPanel/mainPanel";

export function initUI() {
    initMainPanel();
    initTextPanel();
}