import { log } from '../../../utils/log';

const needToLog = false;

// Функция для корректировки вертикального выравнивания буллетов в списках
// В текущей реализации Notion буллеты в списках не выравниваются по центру относительно текста, что особенно заметно при использовании KaTeX
// Эта функция находит все блоки списков и корректирует отступы, чтобы буллеты были вертикально центрированы относительно текста
// TODO: функция вызывается слишком часто, необходима оптимизация
// TODO: текущая реализация просто вычисляет центр, что может не работать идеально для KaTeX формул, смещающих текст ассиметрично
export function adjustBulletAlignment(container: ParentNode = document): void {
  const listBlocks = container.querySelectorAll(':where(.notion-bulleted_list-block, .notion-numbered_list-block):not(.notion-bulleted_list-block .notion-bulleted_list-block, .notion-numbered_list-block .notion-numbered_list-block)');
  
    listBlocks.forEach((listBlock, i) => {
      log(`Processing bullet block ${i + 1}:`, needToLog);
  
      const bulletContainer = listBlock.querySelector('.notion-list-item-box-left');
      const pseudoBefore = listBlock.querySelector('.notion-list-item-box-left .pseudoBefore');
      const textContainer = listBlock.querySelector('div:nth-child(2) .notranslate');
  
      if (bulletContainer instanceof HTMLElement && pseudoBefore instanceof HTMLElement && textContainer instanceof HTMLElement) {
        // Используем высоту всего textContainer, так как KaTeX влияет на неё
        const textHeight = textContainer.getBoundingClientRect().height;
        // Используем высоту pseudoBefore для точки
        const bulletHeight = pseudoBefore.getBoundingClientRect().height;
  
        const paddingTop = (textHeight - bulletHeight) / 2;
  
        // Применяем paddingTop к notion-list-item-box-left
        bulletContainer.style.paddingTop = `${paddingTop}px`;
  
        log(`Bullet block ${i + 1} - textHeight: ${textHeight}, bulletHeight: ${bulletHeight}, paddingTop: ${paddingTop}`, needToLog);
      } else {
        log(`Bullet block ${i + 1} - Skipped: bulletContainer, pseudoBefore, or textContainer not found`, needToLog);
      }
    });
}