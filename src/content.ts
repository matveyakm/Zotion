import { injectStyles } from './modules/textFormatting/constants';
import { processTextStyleLinks } from './modules/textFormatting/scanner';
import { setupMutationObserver } from './modules/textFormatting/init';

injectStyles();

document.addEventListener('DOMContentLoaded', () => {
  setupStyleSelection();
});

setTimeout(() => {
  if (!document.getElementById('custom-style-panel')) {
    setupStyleSelection();
  }
}, 3000);

setupMutationObserver();
