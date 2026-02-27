export const panelHTML = `
<div class="zot-heading">
  Форматирование
</div>

<div id="zot-top-grid">
  <!-- Строка 1 -->
  <button id="zot-bold-btn" class="zot-top-button" style="font-weight: bold">B</button>
  <button id="zot-italic-btn" class="zot-top-button" style="font-style: italic">I</button>
  <div style="grid-column: 3 / span 3; padding: 4px 8px; background: linear-gradient(to right, #ffff00, #ffea00); color: #000; font-weight: bold; border-radius: 6px; font-size: 1.1rem; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
    Example
  </div>


<!-- Строка 2 -->
  <button id="zot-underline-btn" class="zot-top-button zot-decoration-btn" style="text-decoration: underline">U</button>
  <button id="zot-overline-btn" class="zot-top-button zot-decoration-btn" style="text-decoration: overline">O</button>
  <button id="zot-overunderline-btn" class="zot-top-button zot-decoration-btn" style="text-decoration: underline overline">T</button>
  <button id="zot-through-btn" class="zot-top-button zot-decoration-btn" style="text-decoration: line-through">S</button>
  <div style="height: 36px;"></div> 


<!-- Строка 3 -->

  <button id="zot-left-align-btn" class="zot-top-button zot-alignment-button">
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="6" y1="3" x2="18" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="8" x2="16" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="13" x2="18" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="18" x2="16" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
  </button>

  <button id="zot-middle-align-btn" class="zot-top-button zot-alignment-button">
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="5" y1="3" x2="19" y2="3" stroke="currentColor" stroke-width="2"/>
      <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" stroke-width="2"/>
      <line x1="5" y1="13" x2="19" y2="13" stroke="currentColor" stroke-width="2"/>
      <line x1="7" y1="18" x2="17" y2="18" stroke="currentColor" stroke-width="2"/>
    </svg>
  </button>

  <button id="zot-right-align-btn" class="zot-top-button zot-alignment-button">
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="6" y1="3" x2="18" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="8" y1="8" x2="18" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="13" x2="18" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="8" y1="18" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
  </button>

  <select style="height: 36px; padding: 0 8px; background: #2a2a2a; color: #fff; border: 1px solid #444; border-radius: 6px; font-size: 0.9rem; width: 60px;">
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
  <button class="zot-tab zot-tab-active" style="">Текст</button>
  <button class="zot-tab">Фон</button>
  <button class="zot-tab">Линия</button>
</div>


<!-- Color picker -->
<div style="position: relative; width: 80%; height: 120px; padding-right: 30px; background: linear-gradient(to right, #ffff00, #ff0000, #00ff00, #0000ff, #ff00ff, #ffff00); border-radius: 8px; overflow: hidden; margin-bottom: 8px;">
  <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, transparent, #000);"></div>
  <div style="position: absolute; width: 14px; height: 14px; background: #fff; border: 3px solid #000; border-radius: 50%; top: 45%; left: 55%; transform: translate(-50%, -50%); cursor: pointer;"></div>
</div>

<!-- Полоска справа -->
<div style="position: absolute; right: 16px; top: 220px; width: 24px; height: 120px; background: linear-gradient(to bottom, #ff0000, #ff9900, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff); border-radius: 4px;"></div>

<!-- Пресеты -->
<div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 8px;">
 <input type="range" min="0" max="16" value="0" class="zot-slider" id="zot-opacity-slider">
  <div class="zot-preset-color-btn" style="background: #00bfff"></div>
  <div class="zot-preset-color-btn" style="background: #90ee90"></div>
  <div class="zot-preset-color-btn" style="background: #ffffff"></div>
  <!-- HEX -->
  <div style="text-align: center; font-size: 0.9rem; color: #aaa; margin-bottom: 8px;">ADAE47</div>
  </div>

<!-- Ссылка -->
<input type="text" placeholder="Ссылка..." id="external_hyperlink" style="width: 100%; padding: 8px; background: #2a2a2a; color: #fff; border: 1px solid #444; border-radius: 6px; font-size: 0.9rem; margin-bottom: 8px;">

<!-- Кнопка применить -->
<button id="zot-apply-btn">
  <svg width="24" height="24" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="#00ffaa" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>

<div id="zot-advanced-toggle" style="font-size: 0.9rem; color: #888; cursor: pointer; user-select: none; padding: 4px 0;">▸ Дополнительно</div>

<div id="zot-advanced-content" style="display: none; flex-direction: column; gap: 10px; padding-top: 10px;">
  
  <div style="display: flex; gap: 8px; align-items: center;">
    <button title="Top" style="height: 32px; width: 32px; background: #2a2a2a; border: 1px solid #444; color: #fff; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M7 10l5-5 5 5M12 5v14"/></svg>
    </button>
    <button title="Middle" style="height: 32px; width: 32px; background: #2a2a2a; border: 1px solid #444; color: #fff; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16M12 4v16M7 8l5-4 5 4M7 16l5 4 5-4"/></svg>
    </button>
    <button title="Bottom" style="height: 32px; width: 32px; background: #2a2a2a; border: 1px solid #444; color: #fff; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 18h16M7 14l5 5 5-5M12 19V5"/></svg>
    </button>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <span style="font-size: 0.8rem; color: #aaa;">Межбуквенный интервал</span>
    <select style="height: 26px; background: #2a2a2a; color: #fff; border: 1px solid #444; border-radius: 4px; font-size: 0.8rem; width: 60px;">
      <option value="normal">Auto</option>
      <option value="1px">1px</option>
      <option value="2px">2px</option>
      <option value="-0.5px">-0.5</option>
    </select>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <span style="font-size: 0.8rem; color: #aaa;">Интервал между словами</span>
    <select style="height: 26px; background: #2a2a2a; color: #fff; border: 1px solid #444; border-radius: 4px; font-size: 0.8rem; width: 60px;">
      <option value="normal">Auto</option>
      <option value="2px">2px</option>
      <option value="4px">4px</option>
      <option value="10px">10px</option>
    </select>
  </div>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <span style="font-size: 0.8rem; color: #aaa;">Межстрочный интервал</span>
    <select style="height: 26px; background: #2a2a2a; color: #fff; border: 1px solid #444; border-radius: 4px; font-size: 0.8rem; width: 60px;">
      <option value="normal">Auto</option>
      <option value="2px">2px</option>
      <option value="4px">4px</option>
      <option value="10px">10px</option>
    </select>
  </div>
</div>
`;