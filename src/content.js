import { injectStyles } from './modules/textFormatting/constants.js';
//import { setupStyleSelection } from './textFormatting/modules/panel.js';
import { processTextStyleLinks } from './modules/textFormatting/scanner.js';
import { setupMutationObserver } from './modules/textFormatting/init.js';

injectStyles();
document.addEventListener('DOMContentLoaded', () => {
  //processTextStyleLinks();
  setupStyleSelection();
});
setTimeout(() => {
  if (!document.getElementById('custom-style-panel')) {
    //processTextStyleLinks();
    setupStyleSelection();
  }
}, 3000);
setupMutationObserver();
