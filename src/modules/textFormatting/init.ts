// init.ts

import { debounce } from './debounce';
import { processTextStyleLinks } from './scanner';

export function setupMutationObserver(): void {
  const debouncedProcess = debounce((mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      const target = mutation.target as HTMLElement;
      const targetBlock =
        target.closest?.('.notion-text-block') || document;
      processTextStyleLinks(targetBlock);
    });
  }, 2000);

  const observer = new MutationObserver(debouncedProcess);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'style', 'class'],
    attributeOldValue: true,
  });
}
