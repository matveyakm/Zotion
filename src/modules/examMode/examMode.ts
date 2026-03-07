let isExamModeActive: boolean = false;
const STYLE_ID = 'notion-exam-mode-styles';
let wasInjected = false;

const EXAM_CSS = `
  /* Состояние включенного режима */
  body.exam-mode-enabled [data-block-id] [contenteditable="true"] {
    /* Делаем текст нечитаемым, но сохраняем его геометрию */
    color: transparent !important;
    text-shadow: 0 0 8px rgba(0,0,0,0.5); /* Размытие текста */
    transition: all 0.2s ease;
    cursor: help;
  }

  /* Для темной темы меняем цвет тени */
  body.dark.exam-mode-enabled [data-block-id] [contenteditable="true"] {
    text-shadow: 0 0 8px rgba(255,255,255,0.5);
  }

  /* Фоновый паттерн, имитирующий "плашки" под словами */
  body.exam-mode-enabled [data-block-id] [contenteditable="true"] {
    background-image: linear-gradient(
      90deg, 
      var(--theme--bg-default) 0%, 
      var(--theme--bg-default) 10%, 
      transparent 10%, 
      transparent 90%, 
      var(--theme--bg-default) 90%
    );
    background-size: 0.5em 100%; /* Размер "пропуска" между словами */
  }

  /* Проявление конкретного блока при наведении */
  body.exam-mode-enabled [data-block-id] [contenteditable="true"]:hover {
    color: inherit !important;
    text-shadow: none !important;
    background-image: none !important;
  }
`;

const injectGlobalStyles = (): void => {
  if (document.getElementById(STYLE_ID)) return;
  const styleElement = document.createElement('style');
  styleElement.id = STYLE_ID;
  styleElement.innerHTML = EXAM_CSS;
  document.head.appendChild(styleElement);
  wasInjected = true;
};

export const toggleExamMode = (): void => {
  isExamModeActive = !isExamModeActive;
  
  if (isExamModeActive) {
    if (!wasInjected) injectGlobalStyles(); 
    document.body.classList.add('exam-mode-enabled');
  } else {
    document.body.classList.remove('exam-mode-enabled');
  }
};

export const initExamMode = (): void => {
  injectGlobalStyles();

  console.log('Notion Exam Mode Module Loaded');
};