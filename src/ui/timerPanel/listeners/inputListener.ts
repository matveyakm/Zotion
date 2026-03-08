import { changePlannedTime } from '../timerUtils';

// Общая логика для input-ов: сколько будет таймер на фазу учёбы и на фазу отдыха
export function setupInputListeners(panelElement: HTMLElement) {
    // Изменено значение времени, которое планируется учиться
    const studyInput = panelElement.querySelector('#zot-study-time-input') as HTMLInputElement;
    studyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const minutes = parseInt(studyInput.value);
        changePlannedTime(panelElement, 'study', minutes);
    }
    });

    // Изменено значение времени, которое планируется отдыхать
    const relaxInput = panelElement.querySelector('#zot-relax-time-input') as HTMLInputElement;
    relaxInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const minutes = parseInt(relaxInput.value);
        changePlannedTime(panelElement, 'relax', minutes);
    }
    });
}