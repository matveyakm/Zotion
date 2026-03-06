// content.ts

import { injectStyles } from './modules/DOMModifier/constants';
import { setupMutationObserver } from './modules/DOMModifier/init';
import { initUI } from './ui/init';


injectStyles();
setupMutationObserver();


initUI();