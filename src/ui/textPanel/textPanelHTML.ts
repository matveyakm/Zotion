export const panelHTML = `
<div class="zot-heading">
  Форматирование
</div>

<div class="zot-top-grid">
  <!-- Строка 1 -->
  <button id="zot-bold-btn" class="zot-top-button" data-value="1" data-key="fontWeight" title="Жирный" style="font-weight: bold">B</button>
  <button id="zot-italic-btn" class="zot-top-button" data-value="1" data-key="fontStyle" title="Курсив" style="font-style: italic">I</button>
  <div id="zot-font-example" style="grid-column: 3 / span 3; padding: 4px 8px; background: #191919; color: rgb(240, 239, 237); border-radius: 6px; border: 1px solid #888888; font-size: 16px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
    Example
  </div>


<!-- Строка 2 -->
  <button id="zot-underline-btn" class="zot-top-button zot-decoration-btn" data-value="1" data-key="decoration" title="Подчёркнуто" style="text-decoration: underline">U</button>
  <button id="zot-overline-btn" class="zot-top-button zot-decoration-btn" data-value="2" data-key="decoration" title="Надчёркнуто" style="text-decoration: overline">O</button>
  <button id="zot-overunderline-btn" class="zot-top-button zot-decoration-btn" data-value="4" data-key="decoration" title="Подчёркнуто&Надчёркнуто" style="text-decoration: underline overline">T</button>
  <button id="zot-through-btn" class="zot-top-button zot-decoration-btn" data-value="3" data-key="decoration" title="Зачёркнуто" style="text-decoration: line-through">S</button>
  <div style="height: 36px;"></div> 


<!-- Строка 3 -->

  <button id="zot-left-align-btn" class="zot-top-button zot-alignment-button" data-value="0" data-key="textAlign" title="К левому краю">
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="6" y1="3" x2="18" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="8" x2="16" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="13" x2="18" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="18" x2="16" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
  </button>

  <button id="zot-middle-align-btn" class="zot-top-button zot-alignment-button" data-value="1" data-key="textAlign" title="По центру">
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="5" y1="3" x2="19" y2="3" stroke="currentColor" stroke-width="2"/>
      <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" stroke-width="2"/>
      <line x1="5" y1="13" x2="19" y2="13" stroke="currentColor" stroke-width="2"/>
      <line x1="7" y1="18" x2="17" y2="18" stroke="currentColor" stroke-width="2"/>
    </svg>
  </button>

  <button id="zot-right-align-btn" class="zot-top-button zot-alignment-button" data-value="2" data-key="textAlign" title="К правому краю">
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="6" y1="3" x2="18" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="8" y1="8" x2="18" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="13" x2="18" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="8" y1="18" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
  </button>

  <select id="zot-font-size-select" class="zot-small-select" style="width: 60px;">
    <option>Auto</option>
    <option>8</option>
    <option>9</option>
    <option>10</option>
    <option>11</option>
    <option>12</option>
    <option>13</option>
    <option>14</option>
    <option>15</option>
    <option>16</option>
    <option>17</option>
    <option>18</option>
    <option>20</option>
    <option>24</option>
    <option>28</option>
    <option>32</option>
    <option>40</option>
    <option>48</option>
  </select>
</div>


<!-- Вкладки -->
<div style="display: flex; margin-bottom: 12px; justify-content: center; gap: 10px;">
  <button class="zot-tab zot-tab-active" data-key="Text" style="">Текст</button>
  <button class="zot-tab" data-key="Background">Фон</button>
  <button class="zot-tab" data-key="Decoration">Линия</button>
</div>

<div class="zot-picker-container"> 
    <div class="zot-color-picker-box" id="zot-picker-box">
        <div class="zot-picker-cursor" id="zot-picker-cursor"></div>
    </div>

    <!-- Полоска справа -->
  <div id="zot-hue-slider" class="zot-hue-slider-style">
    <div id="zot-hue-marker" class="zot-hue-marker-style"></div>
  </div>
</div>



<!-- Пресеты -->
<div style="display: flex; gap: 8px; justify-content: center; padding-top: 8px">
  <!input type="range" min="0" max="16" value="0" class="zot-slider" id="zot-opacity-slider">
  
  <div class="zot-preset-color-btn" style="background: #00bfff"></div>
  <div class="zot-preset-color-btn" id="zot-last-used-preset-color-btn" style="background: #ffffff"></div>

  <input type="text" placeholder="RRGGBB" id="zot-hex-input" class="zot-hex-input-style">
  <button id="zot-reset-color-btn" class="zot-reset-color-btn-style" title="Сброс">Сброс</button>
  <button id="zot-apply-color-btn" class="zot-apply-color-btn-style" title="Применить цвет">↑</button>
</div>

<!-- Ссылка -->
<!input type="text" placeholder="Ссылка..." id="zot-external_hyperlink" style="width: 100%; padding: 8px; background: #2a2a2a; color: #fff; border: 1px solid #444; border-radius: 6px; font-size: 0.9rem; margin-bottom: 8px;">

<div style="display: flex; flex-direction: column; gap: 2px;">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-left: -9px">
    <button id="zot-toggle-annotation" style="background: none; border: none; cursor: pointer; color: #fff; padding: 4px; display: flex; align-items: center;">
      <svg id="zot-icon-plus" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      <svg id="zot-icon-minus" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      <span style="font-size: 15px; color: #ddd; margin-left: 2px">Добавить аннотацию</span>
    </button>
   
  </div>

  <div id="zot-annotation-content" style="display: none; justify-content: center; padding: 4px 0;">
    <button id="zot-annotation-link-btn" data-value="do" style="display: block; width: 80%; padding: 8px; background: #333; color: #eee; border: 1px solid #555; border-radius: 6px; cursor: pointer; transition: background 0.2s;">
      Сделать ссылкой на аннотацию
    </button>
    <div id="zot-annotation-content-text" style="display: none; flex-direction: column; gap: 0px;">
      <span  style="font-size: 12px; color: #888; text-align: center ">Ссылка успешно добавлена. Теперь вы форматируете содержимое</span>
      <button id="zot-annotation-cancel-btn" style=" background: none; border: none; margin-top: -5px">
        <span  style="font-size: 12px; color: #666; text-align: center; text-decoration: underline; text-decoration-color: rgba(102,102,102,0.6) ">Отменить</span>
      </button>
    </div>
  </div>

  
</div>

<!-- Кнопка применить -->
<button id="zot-apply-btn" class="zot-apply-btn-cl zot-apply-btn-cl-inactive">
  <svg width="24" height="24" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>

<div id="zot-advanced-toggle" style="font-size: 0.9rem; color: #888; cursor: pointer; user-select: none; padding: 4px 0;">▸  Дополнительно</div>

<div id="zot-advanced-content" style="display: none; flex-direction: column; gap: 10px; padding-top: 10px;">
  
  <div style="display: flex; gap: 8px; align-items: center;">
    <button title="Top" class="zot-vertical-align-btn zot-top-button-active" data-value="0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M7 10l5-5 5 5M12 5v14"/></svg>
    </button>
    <button title="Middle" class="zot-vertical-align-btn" data-value="1">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16M12 4v16M7 8l5-4 5 4M7 16l5 4 5-4"/></svg>
    </button>
    <button title="Bottom" class="zot-vertical-align-btn" data-value="2">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 18h16M7 14l5 5 5-5M12 19V5"/></svg>
    </button>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <span style="font-size: 0.8rem; color: #aaa;">Межбуквенный интервал</span>
    <input type="range" min="0" max="15" value="0" class="zot-slider" id="zot-symbol-spacing-slider" style="margin-left: 5px;">
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <span style="font-size: 0.8rem; color: #aaa;">Интервал между словами</span>
    <input type="range" min="0" max="15" value="0" class="zot-slider" id="zot-word-spacing-slider" style="margin-left: 5px;">
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <span style="font-size: 0.8rem; color: #aaa;">Межстрочный интервал</span>
    <input type="range" min="0" max="15" value="0" class="zot-slider" id="zot-line-height-slider" style="margin-left: 5px;">
  </div>
</div>
`;