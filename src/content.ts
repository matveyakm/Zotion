// content.ts

import { injectStyles } from './modules/textFormatting/constants';
import { processTextStyleLinks } from './modules/textFormatting/scanner';
import { setupMutationObserver } from './modules/textFormatting/init';

injectStyles();

setupMutationObserver();
