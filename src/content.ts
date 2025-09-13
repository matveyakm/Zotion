// content.ts

import { injectStyles } from './modules/DOMModifier/constants';
import { setupMutationObserver } from './modules/DOMModifier/init';

injectStyles();

setupMutationObserver();
