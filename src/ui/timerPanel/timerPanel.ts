import { uiCSS, leftPanelStyle } from '../CSS';
import { panelHTML } from './timerPanelsHTML';
import { setTimerButtonState } from './timerMainPanel';

let panelElement: HTMLElement | null = null;
let uiInjected = false;
let uiShown = false;
let isAdvancedShown = false;

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

  const studyInput = document.getElementById('zot-study-time-input') as HTMLInputElement;
  studyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const minutes = parseInt(studyInput.value);
        if (!isNaN(minutes) && minutes > 0) {
            plannedStudyTime = minutes * 60 * 1000;
            if (isStudyPhase) resetTimer(panelElement);
        }
    }
  });

  const relaxInput = document.getElementById('zot-relax-time-input') as HTMLInputElement;
  relaxInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const minutes = parseInt(relaxInput.value);
        if (!isNaN(minutes) && minutes > 0) {
            plannedRelaxTime = minutes * 60 * 1000;
            if (!isStudyPhase) resetTimer(panelElement);
        }
    }
  });

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

  const anticipatorilyButton = panelElement.querySelector('#zot-anticipatorily-btn') as HTMLButtonElement;
  anticipatorilyButton.addEventListener('click', () => {
    console.log('Panel: anticipatorily switch phase');

    resetTimer(panelElement, true);
  });


  const toggleBtn = panelElement.querySelector('#zot-timer-advanced-toggle');
  const content = panelElement.querySelector('#zot-timer-advanced-content') as HTMLElement;
  if (toggleBtn && content) {
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = content.style.display === 'none' || content.style.display === '';
        
        content.style.display = isHidden ? 'flex' : 'none';
        toggleBtn.textContent = isHidden ? '▾  Дополнительно' : '▸  Дополнительно';
        isAdvancedShown = isHidden;
    });
  }

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

function pauseTimer(panelElement: HTMLElement, isAnticipatorily : boolean = false) {
    console.log('Panel: pause timer');
    if (!isTimerGoing) return;

    const setTimerButton = panelElement.querySelector('#zot-set-timer-btn') as HTMLButtonElement;
    const timerEndAt = panelElement.querySelector('#zot-timer-end-at') as HTMLElement;

    session.studyActive += isStudyPhase ? Date.now() - session.phaseStart : 0;
    session.relaxActive += !isStudyPhase ? Date.now() - session.phaseStart : 0;

    session.phaseStart = 0;
    
    setTimerButton.setAttribute('data-value', 'start');
    setTimerButton.textContent = 'Пуск';
    isTimerGoing = false;
    if (isTimeElapsed || isAnticipatorily) {
        reminder = null;
        const timerDisplay = panelElement.querySelector('#zot-timer-phase') as HTMLElement;
        isStudyPhase = !isStudyPhase;
        timerDisplay.textContent = isStudyPhase ? 'Учёба' : 'Отдых';
        if (isTimeElapsed) {
            setTimerButtonState('ellapsed');
            if (uiShown) {
                isTimeElapsed = false;
                makeTimerGo(panelElement);
                return;
            }
        }
    } else if (timerEndTimestamp){
        setTimerButtonState('pause');
        reminder = timerEndTimestamp - Date.now();
    }
    timerEndTimestamp = null;
    timerEndAt.textContent = '--:--';
}

function resetTimer(panelElement: HTMLElement, isAnticipatorily : boolean = false) {
    pauseTimer(panelElement, isAnticipatorily);
    reminder = null;
    displayTime(panelElement, isStudyPhase ? plannedStudyTime : plannedRelaxTime);
    setTimerButtonState('normal');
}

function setStrictTimer(panelElement: HTMLElement) {
  console.log('Panel: set strict timer');
  const statsTotal = panelElement.querySelector('#zot-timer-stat-total') as HTMLElement;
  const statsStudy = panelElement.querySelector('#zot-timer-stat-study') as HTMLElement;
  const statsRelax = panelElement.querySelector('#zot-timer-stat-relax') as HTMLElement;
  
  const interval = setInterval(() => {
    if (!uiShown) {
        clearInterval(interval);
    }
    
    if (isTimerGoing && timerEndTimestamp) {
        displayTime(panelElement, timerEndTimestamp - Date.now());
    }

    if (isAdvancedShown) {
        displayStats(statsTotal, Date.now() - session.start);
        displayStats(statsStudy, session.studyActive + (isStudyPhase && isTimerGoing ? Date.now() - session.phaseStart : 0));
        displayStats(statsRelax, session.relaxActive + (!isStudyPhase && isTimerGoing ? Date.now() - session.phaseStart : 0));
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

function displayTime(panelElement: HTMLElement, ms: number) {
    const timer = panelElement.querySelector('#zot-timer-display') as HTMLElement;
    if (timer){
        if (ms < 0) ms = 0;
        const totalMinutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);

        timer.textContent = `${totalMinutes}:${seconds.toString().padStart(2, '0')}`;
    } 
}

function displayStats(stats: HTMLElement | null, ms: number) {
  if (!stats) return;
  const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  stats.textContent = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

function checkTime(panelElement: HTMLElement) {
    if (timerEndTimestamp && Date.now() >= timerEndTimestamp && !isTimeElapsed) {
        console.log('Panel: time is elapsed');
        isTimeElapsed = true;
        pauseTimer(panelElement);
    }
}