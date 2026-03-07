let isExamModeActive: boolean = false;
const STYLE_ID = 'notion-exam-mode-styles';
let wasInjected = false;

const EXAM_CSS = `
  body.exam-mode-enabled [contenteditable="true"]:not([aria-roledescription*="heading"]):not([placeholder*="Heading"]) {
    color: transparent !important;
    text-shadow: 0 0 6px rgba(0,0,0,0.5) !important;
    transition: all 0.2s ease;
    cursor: help;
  }

  body.dark.exam-mode-enabled [contenteditable="true"]:not([aria-roledescription*="heading"]):not([placeholder*="Heading"]) {
    text-shadow: 0 0 6px rgba(255,255,255,0.5) !important;
  }

  body.exam-mode-enabled [contenteditable="true"]:not([aria-roledescription*="heading"]):hover {
    color: inherit !important;
    text-shadow: none !important;
  }

  body.exam-mode-enabled [contenteditable="true"]:hover .notion-text-equation-token {
    filter: none;
    opacity: 1;
  }

  body.exam-mode-enabled [aria-roledescription*="heading"] {
    color: inherit !important;
    text-shadow: none !important;
    filter: none !important;
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