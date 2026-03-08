import { makeTimerGo, pauseTimer, resetTimer } from '../timerUtils';

// Общая логика для всех кнопок: Сброс, Досрочно и Пуск/Пауза
export function setupButtonListeners (panelElement: HTMLElement) {
    // Пуск/Пауза
    const setTimerButton = panelElement.querySelector('#zot-set-timer-btn') as HTMLButtonElement;
    setTimerButton.addEventListener('click', () => {
        const setTimerButtonState = setTimerButton.getAttribute('data-value');
        if (setTimerButtonState === 'start') { // Нажат "Пуск"
            makeTimerGo(panelElement);
        } else if (setTimerButtonState === 'pause') { // Нажата "Пауза"
            pauseTimer(panelElement);
        }
    });

    // Сброс
    const resetTimerButton = panelElement.querySelector('#zot-reset-timer-btn') as HTMLButtonElement;
    resetTimerButton.addEventListener('click', () => {
        resetTimer(panelElement);
    });

    // Досрочно
    const anticipatorilyButton = panelElement.querySelector('#zot-anticipatorily-btn') as HTMLButtonElement;
    anticipatorilyButton.addEventListener('click', () => {
        resetTimer(panelElement, true);
    });
}