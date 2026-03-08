import { setTimerButtonState } from './timerMainPanel';
import { uiShown } from './timerPanel';
import { isAdvancedShown } from './listeners/statsListener';

let isTimerGoing = false; // Тикает ли таймер, установленный пользователем

const session = {
    start: Date.now(), // Время, когда инициализировалось расширение (для статистики)
    studyActive: 0, // Накопленное время учебы (для статистики)
    relaxActive: 0, // Накопленное время отдыха (для статистики)
    phaseStart: 0,  // Когда началась текущая фаза (для непосредственно таймера)
};

let isStudyPhase = true; // true - учеба, false - отдых
const plannedTime: { study: number; relax: number } = {
    study: 40 * 60 * 1000, // Сколько выставлено в zot-study-time-input
    relax: 10 * 60 * 1000 // Сколько выставлено в zot-relax-time-input
  };
let timerEndTimestamp: number | null = null; // Когда таймер должен пропищать
let isTimeElapsed = false; // Вышло ли время таймера, установленного пользователем
let reminder: number | null = null; // Остаток времени таймера при паузе

// Изменятет plannedTime, вызывается при изменении числа в zot-study-time-input или zot-relax-time-input
export function changePlannedTime(panelElement: HTMLElement, key: 'study' | 'relax', minutes: number) {
    if (!isNaN(minutes) && minutes > 0) {
        plannedTime[key] = minutes * 60 * 1000;
        if (isStudyPhase === (key === 'study')) resetTimer(panelElement);
    }
}

// Запускает (или возобновляет) таймер, устанавливаемый непосредственно пользователем
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

// Останавливает (или приостанавливает) таймер, устанавливаемый непосредственно пользоваталем
// вызывается с isAnticipatorily = true при нажатии кнопки "Досрочно" (т.е. досрочно переключится с учёбы на отдых или наоборот)
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

// Сбрасывает таймер, устанавливаемый непосредственно пользоваталем
// вызывается с isAnticipatorily = true при нажатии кнопки "Досрочно" (т.е. досрочно переключится с учёбы на отдых или наоборот)
export function resetTimer(panelElement: HTMLElement, isAnticipatorily : boolean = false) {
    pauseTimer(panelElement, isAnticipatorily);
    reminder = null;
    displayTime(panelElement, plannedTime[isStudyPhase ? 'study' : 'relax']);
    setTimerButtonState('normal');
}

// Точный тикер. Используется только если открыты настройки таймера
// Отображает в интерфейс текущие значения realTime с хорошей точностью (1 sec)
// Проверяет не вышло ли время на таймере
export function setStrictTimer(panelElement: HTMLElement) {
  console.log('Panel: set strict timer');
  
  // Если время вышло текущей фпзы и панель открывается, то начинается следующая фаза
  if (uiShown && isTimeElapsed) {
        isTimeElapsed = false;
        makeTimerGo(panelElement);
   }

  const statsTotal = panelElement.querySelector('#zot-timer-stat-total') as HTMLElement;
  const statsStudy = panelElement.querySelector('#zot-timer-stat-study') as HTMLElement;
  const statsRelax = panelElement.querySelector('#zot-timer-stat-relax') as HTMLElement;

  // Непосредственно сам тикер
  const interval = setInterval(() => {
    // Выключается, если ui таймера скрыт. В то же время из hidePanel запускается ленивый тикер
    if (!uiShown) {
        clearInterval(interval);
    }
    
    // Если таймер идёт, надо отображать оставшееся время
    if (isTimerGoing && timerEndTimestamp) {
        displayTime(panelElement, timerEndTimestamp - Date.now());
    }

    // Если открыто "Дополнительно", где отображается статистика, то там её отображаем
    if (isAdvancedShown) {
        displayStats(statsTotal, Date.now() - session.start);
        displayStats(statsStudy, session.studyActive + (isStudyPhase && isTimerGoing ? Date.now() - session.phaseStart : 0));
        displayStats(statsRelax, session.relaxActive + (!isStudyPhase && isTimerGoing ? Date.now() - session.phaseStart : 0));
    }
        
    // Проверяем не вышло ли время таймера
    checkTime(panelElement);
      
   }, 1000);
}

// Ленивый тикер. Используется только если настройки таймера скрыты, т.е. в фоновом режиме
// Проверяет не вышло ли время на таймере с низкой точностью (20 sec) для оптимизации
// TODO: менять частоту обновления тикера в зависимости от отсчитываемого времени
//      -- если таймер установили на 1 минуту, то погрешность должна быть ~5 сек
//      -- если таймер установили на 1+ час, то погрешность может доходить и до нескольких минут
export function setLazyTimer(panelElement: HTMLElement) {
    console.log('Panel: set lazy timer');
    const interval = setInterval(() => {
        // Выключается, если ui таймера открыт. В то же время из showPanel запускается точный тикер
        if (uiShown) {
            clearInterval(interval);
        }
        
        // Проверяем не вышло ли время таймера
        checkTime(panelElement);
    }, 20000);
}

// Отображает в UI оставшееся время на таймере
function displayTime(panelElement: HTMLElement, ms: number) {
    const timer = panelElement.querySelector('#zot-timer-display') as HTMLElement;
    if (timer){
        if (ms < 0) ms = 0;
        const totalMinutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);

        timer.textContent = `${totalMinutes}:${seconds.toString().padStart(2, '0')}`;
    } 
}

// Отображает в UI статистику
function displayStats(stats: HTMLElement | null, ms: number) {
  if (!stats) return;
  const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  stats.textContent = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

// Проверка не вышло ли время таймера
function checkTime(panelElement: HTMLElement) {
    if (timerEndTimestamp && Date.now() >= timerEndTimestamp && !isTimeElapsed) {
        console.log('Panel: time is elapsed');
        isTimeElapsed = true;
        pauseTimer(panelElement);
    }
}