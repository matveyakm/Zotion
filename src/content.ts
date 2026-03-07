// content.ts

import { injectStyles } from './modules/DOMModifier/constants';
import { setupMutationObserver } from './modules/DOMModifier/init';
import { initUI } from './ui/init';
import { initExamMode , toggleExamMode} from './modules/examMode/examMode';


injectStyles();
setupMutationObserver();


initUI();

initExamMode();
toggleExamMode();