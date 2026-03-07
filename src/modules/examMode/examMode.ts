let isExamModeActive: boolean = false;
const STYLE_ID = 'notion-exam-mode-styles';
let wasInjected = false;

const EXAM_CSS = `
  body.exam-mode-enabled [data-block-id] {
    position: relative !important;
  }

  body.exam-mode-enabled [data-block-id] [contenteditable="true"],
  body.exam-mode-enabled [data-block-id] [role="button"],
  body.exam-mode-enabled .notion-image-block {
    position: relative;
    color: transparent !important;
    transition: color 0.2s ease;
  }

  body.exam-mode-enabled [data-block-id] [contenteditable="true"]::after,
  body.exam-mode-enabled [data-block-id] [role="button"]::after,
  body.exam-mode-enabled .notion-image-block::after {
    content: "";
    position: absolute;
    inset: 0; /* Растягиваем на весь блок */
    background: #222;
    border: 1px dashed var(--theme--divider, #e0e0e0);
    backdrop-filter: blur(10px); /* Для пущей секретности */
    z-index: 100;
    pointer-events: none;
    opacity: 1;
    transition: opacity 0.2s ease;
  }

  body.exam-mode-enabled [data-block-id]:hover [contenteditable="true"],
  body.exam-mode-enabled [data-block-id]:hover [role="button"] {
    color: inherit !important;
  }

  body.exam-mode-enabled [data-block-id]:hover [contenteditable="true"]::after,
  body.exam-mode-enabled [data-block-id]:hover [role="button"]::after,
  body.exam-mode-enabled [data-block-id]:hover .notion-image-block::after {
    opacity: 0;
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