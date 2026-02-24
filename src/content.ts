// content.ts

import { injectStyles } from './modules/DOMModifier/constants';
import { setupMutationObserver } from './modules/DOMModifier/init';
import { initBoldUI } from './ui/panel';


injectStyles();
setupMutationObserver();


initBoldUI();
