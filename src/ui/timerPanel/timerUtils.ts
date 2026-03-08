import { setTimerButtonState } from './timerMainPanel';
import { uiShown } from './timerPanel';
import { isAdvancedShown } from './listeners/statsListener';

let isTimerGoing = false;

const session = {
    start: Date.now(),
    studyActive: 0, // Накопленное время учебы (ms)
    relaxActive: 0, // Накопленное время отдыха (ms)
    phaseStart: 0,  // Когда началась текущая фаза (ms)
};

let isStudyPhase = true; // true - учеба, false - отдых
const plannedTime: { study: number; relax: number } = {
    study: 0.15 * 60 * 1000, // Сколько выставлено в zot-study-time-input
    relax: 0.15 * 60 * 1000 // Сколько выставлено в zot-relax-time-input
  };
let timerEndTimestamp: number | null = null; // Когда таймер должен пропищать
let isTimeElapsed = false; // Вышло ли время
let reminder: number | null = null; // Остаток (после паузы)

export function changePlannedTime(panelElement: HTMLElement, key: 'study' | 'relax', minutes: number) {
    if (!isNaN(minutes) && minutes > 0) {
        plannedTime[key] = minutes * 60 * 1000;
        if (isStudyPhase === (key === 'study')) resetTimer(panelElement);
    }
}

export function makeTimerGo(panelElement: HTMLElement) {
    console.log('Panel: start timer');
    if (isTimerGoing) return;

    const setTimerButton = panelElement.querySelector('#zot-set-timer-btn') as HTMLElement;
    const timerEndAt = panelElement.querySelector('#zot-timer-end-at') as HTMLElement;

    session.phaseStart = Date.now();
    timerEndTimestamp = session.phaseStart + (reminder || plannedTime[isStudyPhase? 'study' : 'relax']);
    isTimerGoing = true;

    setTimerButton.setAttribute('data-value', 'pause');
    setTimerButton.textContent = 'Пауза';
    timerEndAt.textContent = `${new Date(timerEndTimestamp).toLocaleTimeString().substring(0, 5)}`;
    setTimerButtonState(isStudyPhase ? 'study' : 'relax');
}

export function pauseTimer(panelElement: HTMLElement, isAnticipatorily : boolean = false) {
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

export function resetTimer(panelElement: HTMLElement, isAnticipatorily : boolean = false) {
    pauseTimer(panelElement, isAnticipatorily);
    reminder = null;
    displayTime(panelElement, plannedTime[isStudyPhase ? 'study' : 'relax']);
    setTimerButtonState('normal');
}

export function setStrictTimer(panelElement: HTMLElement) {
  console.log('Panel: set strict timer');

  if (uiShown && isTimeElapsed) {
        isTimeElapsed = false;
        makeTimerGo(panelElement);
    }
  

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

export function setLazyTimer(panelElement: HTMLElement) {
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