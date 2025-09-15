export function adjustBulletAlignment(container: ParentNode = document): void {
  const listBlocks = container.querySelectorAll(':where(.notion-bulleted_list-block, .notion-numbered_list-block):not(.notion-bulleted_list-block .notion-bulleted_list-block, .notion-numbered_list-block .notion-numbered_list-block)');
  
    listBlocks.forEach((listBlock, i) => {
      console.log(`Processing bullet block ${i + 1}:`, listBlock);
  
      const bulletContainer = listBlock.querySelector('.notion-list-item-box-left');
      const pseudoBefore = listBlock.querySelector('.notion-list-item-box-left .pseudoBefore');
      const textContainer = listBlock.querySelector('div:nth-child(2) .notranslate');
  
      console.log(`Bullet block ${i + 1} - bulletContainer:`, bulletContainer, 'pseudoBefore:', pseudoBefore, 'textContainer:', textContainer);
  
      if (bulletContainer instanceof HTMLElement && pseudoBefore instanceof HTMLElement && textContainer instanceof HTMLElement) {
        // Используем высоту всего textContainer, так как KaTeX влияет на неё
        const textHeight = textContainer.getBoundingClientRect().height;
        // Используем высоту pseudoBefore для точки
        const bulletHeight = pseudoBefore.getBoundingClientRect().height;
  
        const paddingTop = (textHeight - bulletHeight)/2;
  
        // Применяем paddingTop к notion-list-item-box-left
        bulletContainer.style.paddingTop = `${paddingTop}px`;
  
        console.log(`Bullet block ${i + 1} - textHeight: ${textHeight}, bulletHeight: ${bulletHeight}, paddingTop: ${paddingTop}`);
      } else {
        console.log(`Bullet block ${i + 1} - Skipped: bulletContainer, pseudoBefore, or textContainer not found`);
      }
    });
  }