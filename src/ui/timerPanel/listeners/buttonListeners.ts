import { makeTimerGo, pauseTimer, resetTimer } from '../timerUtils';

export function setupButtonListeners (panelElement: HTMLElement) {
    const setTimerButton = panelElement.querySelector('#zot-set-timer-btn') as HTMLButtonElement;
    setTimerButton.addEventListener('click', () => {
        const setTimerButtonState = setTimerButton.getAttribute('data-value');
        if (setTimerButtonState === 'start') {
            makeTimerGo(panelElement);
        } else if (setTimerButtonState === 'pause') {
            pauseTimer(panelElement);
        }
    });

    const resetTimerButton = panelElement.querySelector('#zot-reset-timer-btn') as HTMLButtonElement;
    resetTimerButton.addEventListener('click', () => {
        resetTimer(panelElement);
    });

    const anticipatorilyButton = panelElement.querySelector('#zot-anticipatorily-btn') as HTMLButtonElement;
    anticipatorilyButton.addEventListener('click', () => {
        resetTimer(panelElement, true);
    });
}