import { initTextPanel } from "./textPanel/textPanel";
import { initMainPanel } from "./mainPanel/mainPanel";
import { initExamModePanel } from './examModePanel/examModePanel';
import { initBlockPanel } from "./blockPanel/blockPanel";
import { initTimerMainPanel } from "./timerPanel/timerMainPanel";

export function initUI() {
    initExamModePanel();
    initTimerMainPanel();

    // Показывает панель редактирования, только если пользователь -- редактор страницы
    const interval = setInterval(() => {
        if (document.querySelector('.notion-sidebar-switcher') !== null) {
            initMainPanel();
            initTextPanel();
            initBlockPanel();
            clearInterval(interval);
        }
    }, 5000);
}