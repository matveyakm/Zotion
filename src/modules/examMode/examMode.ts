let isExamModeActive: boolean = false;
const STYLE_ID = 'notion-exam-mode-styles';
const REVEAL_STYLE_ID = 'notion-exam-mode-reveal-rules';
let wasInjected = false;

const activeReveals = new Map<string, ReturnType<typeof setTimeout>>();

const EXAM_CSS = `
  body.exam-mode-enabled [contenteditable="true"]:not([aria-roledescription*="heading"]):not([placeholder*="Heading"]) {
    color: transparent !important;
    text-shadow: 0 0 7px rgba(0,0,0,0.5) !important;
    transition: all 0.2s ease;
    cursor: help;
  }

  body.dark.exam-mode-enabled [contenteditable="true"]:not([aria-roledescription*="heading"]):not([placeholder*="Heading"]) {
    text-shadow: 0 0 7px rgba(255,255,255,0.5) !important;
  }

  body.exam-mode-enabled .notion-equation-block {
    filter: blur(12px); /* Для больших формул блюр нужен чуть сильнее */
    transition: filter 0.2s ease, opacity 0.2s ease;
    opacity: 0.6;
    cursor: help;
  }
  
  body.exam-mode-enabled [contenteditable="true"]:not([aria-roledescription*="heading"]):hover {
    color: inherit !important;
    text-shadow: none !important;
  }

  body.exam-mode-enabled .notion-equation-block:hover {
    filter: blur(0);
    opacity: 1;
  }

  body.exam-mode-enabled [aria-roledescription*="heading"],
  body.exam-mode-enabled [placeholder*="Heading"] {
    color: inherit !important;
    text-shadow: none !important;
    filter: none !important;
    opacity: 1 !important;
  }
`;

// Логика раскрытия контента (используется при клике на блок)
const updateRevealStyles = () => {
  let styleTag = document.getElementById(REVEAL_STYLE_ID) as HTMLStyleElement;
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = REVEAL_STYLE_ID;
    document.head.appendChild(styleTag);
  }

  const ids = Array.from(activeReveals.keys());
  if (ids.length === 0) {
    styleTag.innerHTML = '';
    return;
  }

  styleTag.innerHTML = ids.map(id => `
    body.exam-mode-enabled [data-block-id="${id}"][data-block-id="${id}"] [contenteditable="true"],
    body.exam-mode-enabled [data-block-id="${id}"][data-block-id="${id}"].notion-equation-block {
      filter: none !important;
      color: var(--c-textPri) !important;
      text-shadow: none !important;
      opacity: 1 !important;
      background-image: none !important;
      transition: none !important;
    }
  `).join('\n');
};

// Обработчик кликов по блокам для временного раскрытия содержимого
const handleBlockClick = (e: MouseEvent) => {
  if (!isExamModeActive) return;

  const target = e.target as HTMLElement;
  const block = target.closest('[data-block-id]');
  
  if (block) {
    const blockId = block.getAttribute('data-block-id');
    if (!blockId) return;

    if (block.querySelector('[aria-roledescription*="heading"]')) return;

    if (activeReveals.has(blockId)) {
      clearTimeout(activeReveals.get(blockId));
    }

    activeReveals.set(blockId, setTimeout(() => {
      activeReveals.delete(blockId);
      updateRevealStyles();
    }, 30000));

    updateRevealStyles();
  }
};


// Внедрение CSS-инъекции для блюра текста в examMode
const injectGlobalStyles = (): void => {
  if (document.getElementById(STYLE_ID)) return;
  const styleElement = document.createElement('style');
  styleElement.id = STYLE_ID;
  styleElement.innerHTML = EXAM_CSS;
  document.head.appendChild(styleElement);
  wasInjected = true;
};

// Включение/выключение режима экзамена
export const toggleExamMode = (): void => {
  isExamModeActive = !isExamModeActive;
  
  if (isExamModeActive) {
    if (!wasInjected) injectGlobalStyles(); 
    document.body.classList.add('exam-mode-enabled');
    document.addEventListener('click', handleBlockClick);
  } else {
    document.body.classList.remove('exam-mode-enabled');
    document.removeEventListener('click', handleBlockClick);
  }
  activeReveals.clear();
  updateRevealStyles();
};

// Инициализация модуля Exam Mode
export const initExamMode = (): void => {
  injectGlobalStyles();

  console.log('Notion Exam Mode Module Loaded');
};