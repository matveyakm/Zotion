import { initTextPanel } from "./textPanel/textPanel";
import { initMainPanel } from "./mainPanel/mainPanel";

export function initUI() {
    // Показывает панель редактирования, только если пользователь -- редактор страницы
    const interval = setInterval(() => {
        if (document.querySelector('.notion-sidebar-switcher') !== null) {
            initMainPanel();
            initTextPanel();
            clearInterval(interval);
        }
    }, 5000);
}