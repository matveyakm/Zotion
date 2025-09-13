// init.ts

import { debounce } from './debounce';
import { processAttributedLinks } from './scanner';

const UPDATE_INTERVAL = 2000; // milliseconds

export function setupMutationObserver(): void {
    const debouncedProcess = debounce((...args: unknown[]) => {
    // args[0] — mutations, args[1] — observer
    const mutations = args[0] as MutationRecord[];
      mutations.forEach((mutation) => {
        const target = mutation.target as HTMLElement;
        const targetBlock =
          target.closest?.('.notion-text-block') || document;
        processAttributedLinks(targetBlock);
      });
    }, UPDATE_INTERVAL);
  

  const observer = new MutationObserver(debouncedProcess);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href', 'style', 'class'],
    attributeOldValue: true,
  });
}
