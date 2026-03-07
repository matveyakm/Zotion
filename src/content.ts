// content.ts

import { injectStyles } from './modules/DOMModifier/constants';
import { setupMutationObserver } from './modules/DOMModifier/init';
import { initUI } from './ui/init';
import { initExamMode } from './modules/examMode/examMode';
import { initExamModePanel } from './ui/examModePanel/examModePanel';


injectStyles();
setupMutationObserver();

initUI();

initExamMode();
initExamModePanel();