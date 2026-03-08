import { uiCSS, leftPanelStyle } from '../CSS';
import { panelHTML } from './timerPanelsHTML';
import { setTimerButtonState } from './timerMainPanel';

let panelElement: HTMLElement | null = null;
let uiInjected = false;
let uiShown = false;

let isTimerGoing = false;

// Состояние (храним только метки времени)
const session = {
    start: Date.now(),
    studyActive: 0, // Накопленное время учебы (ms)
    relaxActive: 0, // Накопленное время отдыха (ms)
    phaseStart: 0,  // Когда началась текущая фаза (ms)
};

let isStudyPhase = true; // true - учеба, false - отдых
let plannedStudyTime: number = 0.15 * 60 * 1000; // Сколько выставлено в zot-study-time-input
let plannedRelaxTime: number = 0.15 * 60 * 1000; // Сколько выставлено в zot-relax-time-input
let timerEndTimestamp: number | null = null; // Когда таймер должен пропищать
let isTimeElapsed = false; // Вышло ли время
let reminder: number | null = null;

function createPanel() {
  if (panelElement) return panelElement;

  if (!document.getElementById('zot-timer-panel')) {
    const styleTag = document.createElement('style');
    styleTag.id = 'zot-timer-panel';
    styleTag.textContent = uiCSS;
    document.head.appendChild(styleTag);
  }

  panelElement = document.createElement('div');
  panelElement.id = 'zot-timer-panel';
  panelElement.innerHTML = panelHTML;
  panelElement.style.cssText = leftPanelStyle;
  panelElement.style.top = '';
  panelElement.style.bottom = '100px';

  document.body.appendChild(panelElement);

  const setTimerButton = panelElement.querySelector('#zot-set-timer-btn') as HTMLButtonElement;
  setTimerButton.addEventListener('click', () => {
    let setTimerButtonState = setTimerButton.getAttribute('data-value');
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


  return panelElement;
}

export function showTimerPanel() {
  const panel = createPanel();
  panel.style.display = 'block';
  uiShown = true;

  if (isTimeElapsed) {
    isTimeElapsed = false;
    makeTimerGo(panel);
  }

  setStrictTimer(panel);
}

export function hideTimerPanel() {
  uiShown = false;
  if (panelElement) {
    panelElement.style.display = 'none';
    setLazyTimer(panelElement);
  }
}

export function initTimerPanel() {
  if (uiInjected) return;

  console.log('Panel: init timer panel');
  
  const panel = createPanel();

  setLazyTimer(panel);

  uiInjected = true;
}

function makeTimerGo(panelElement: HTMLElement) {
    console.log('Panel: start timer');
    if (isTimerGoing) return;

    const setTimerButton = panelElement.querySelector('#zot-set-timer-btn') as HTMLElement;
    const timerEndAt = panelElement.querySelector('#zot-timer-end-at') as HTMLElement;

    session.phaseStart = Date.now();
    timerEndTimestamp = session.phaseStart + (reminder || (isStudyPhase? plannedStudyTime : plannedRelaxTime));
    isTimerGoing = true;

    setTimerButton.setAttribute('data-value', 'pause');
    setTimerButton.textContent = 'Пауза';
    timerEndAt.textContent = `${new Date(timerEndTimestamp).toLocaleTimeString().substring(0, 5)}`;
    setTimerButtonState(isStudyPhase ? 'study' : 'relax');
}

function pauseTimer(panelElement: HTMLElement) {
    console.log('Panel: pause timer');
    if (!isTimerGoing) return;

    const setTimerButton = panelElement.querySelector('#zot-set-timer-btn') as HTMLButtonElement;
    const timerEndAt = panelElement.querySelector('#zot-timer-end-at') as HTMLElement;

    session.phaseStart = 0;

    setTimerButton.setAttribute('data-value', 'start');
    setTimerButton.textContent = 'Пуск';
    isTimerGoing = false;
    if (isTimeElapsed) {
        setTimerButtonState('ellapsed');
        const timerDisplay = panelElement.querySelector('#zot-timer-phase') as HTMLElement;
        isStudyPhase = !isStudyPhase;
        timerDisplay.textContent = isStudyPhase ? 'Учёба' : 'Отдых';
        if (uiShown) {
            isTimeElapsed = false;
            makeTimerGo(panelElement);
            return;
        }
    } else if (timerEndTimestamp){
        setTimerButtonState('pause');
        reminder = timerEndTimestamp - Date.now();
    }
    timerEndTimestamp = null;
    timerEndAt.textContent = '--:--';
}

function resetTimer(panelElement: HTMLElement) {
    pauseTimer(panelElement);
    reminder = null;
    displayTime(panelElement, isStudyPhase ? plannedStudyTime : plannedRelaxTime);
    setTimerButtonState('normal');
}

function setStrictTimer(panelElement: HTMLElement) {
  console.log('Panel: set strict timer');
  
  const interval = setInterval(() => {
    if (!uiShown) {
        clearInterval(interval);
    }
    
    if (isTimerGoing && timerEndTimestamp) {
        displayTime(panelElement, timerEndTimestamp - Date.now());
    }
        
    checkTime(panelElement);
      
   }, 1000);
}

function setLazyTimer(panelElement: HTMLElement) {
    console.log('Panel: set lazy timer');
    const interval = setInterval(() => {
        if (uiShown) {
            clearInterval(interval);
        }
        
        checkTime(panelElement);
    
          
    }, 20000);
}

function displayTime(panelElement: HTMLElement, time: number) {
    const timerDisplay = panelElement.querySelector('#zot-timer-display');
    if (timerDisplay){
        if (time < 0) time = 0;
        const totalMinutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);

        timerDisplay.textContent = `${totalMinutes}:${seconds.toString().padStart(2, '0')}`;
    } 
}

function checkTime(panelElement: HTMLElement) {
    if (timerEndTimestamp && Date.now() >= timerEndTimestamp && !isTimeElapsed) {
        console.log('Panel: time is elapsed');
        isTimeElapsed = true;
        pauseTimer(panelElement);
    }
}