import { debounce } from './debounce.js';
import { processTextStyleLinks } from './scanner.js';

export function setupMutationObserver() {
  const debouncedProcess = debounce((mutations) => {
    mutations.forEach(mutation => {
      const targetBlock = mutation.target.closest?.('.notion-text-block') || document;
      processTextStyleLinks(targetBlock);
    });
  }, 2000);

  const observer = new MutationObserver(debouncedProcess);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'style', 'class'],
    attributeOldValue: true
  });
}
