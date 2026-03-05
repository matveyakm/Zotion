export const panelHTML = `
<div class="zot-heading">
  Форматирование
</div>

<select id="zot-block-type-select" style="width: 100%; height: 36px; padding: 0 8px; background: #2a2a2a; color: #fff; border: 1px solid #444; border-radius: 6px; font-size: 0.9rem; margin-bottom: 10px">
    <option>Callout</option>
    <option>Quote</option>
    <option>Table Cell</option>
    <option>Divider</option>
</select>

<div class="zot-top-grid">
  <!-- Строка 1 -->

  <button class="zot-textable-block-view zot-top-button zot-alignment-button " data-value="0" data-key="textAlign" title="К левому краю">
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="6" y1="3" x2="18" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="8" x2="16" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="13" x2="18" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="18" x2="16" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
  </button>

  <button class="zot-textable-block-view zot-top-button zot-alignment-button" data-value="1" data-key="textAlign" title="По центру">
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="5" y1="3" x2="19" y2="3" stroke="currentColor" stroke-width="2"/>
      <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" stroke-width="2"/>
      <line x1="5" y1="13" x2="19" y2="13" stroke="currentColor" stroke-width="2"/>
      <line x1="7" y1="18" x2="17" y2="18" stroke="currentColor" stroke-width="2"/>
    </svg>
  </button>

  <button class="zot-textable-block-view zot-top-button zot-alignment-button" data-value="2" data-key="textAlign" title="К правому краю">
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="6" y1="3" x2="18" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="8" y1="8" x2="18" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="6" y1="13" x2="18" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="8" y1="18" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
  </button>

  <select id="zot-border-size-select" class="zot-small-select">
    <option>Auto</option>
    <option>0</option>
    <option>1</option>
    <option>2</option>
    <option>3</option>
    <option>4</option>
    <option>5</option>
    <option>6</option>
    <option>7</option>
    <option>8</option>
    <option>9</option>
    <option>10</option>
    <option>11</option>
    <option>12</option>
    <option>13</option>
    <option>14</option>
    <option>15</option>
  </select>

  <!-- Строка 2 -->

  <button class="zot-textable-block-view zot-top-button zot-v-alignment-button" data-value="0" data-key="verticalAlign" title="К левому краю">
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="5" y1="3" x2="19" y2="3" stroke="currentColor" stroke-width="2"/>
      <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" stroke-width="2"/>
      <line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" stroke-width="2"/>
    </svg>
  </button>

  <button class="zot-textable-block-view zot-top-button zot-v-alignment-button" data-value="1" data-key="verticalAlign" title="По центру">
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="7" y1="6" x2="17" y2="6" stroke="currentColor" stroke-width="2"/>
      <line x1="5" y1="11" x2="19" y2="11" stroke="currentColor" stroke-width="2"/>
      <line x1="7" y1="16" x2="17" y2="16" stroke="currentColor" stroke-width="2"/>
    </svg>
  </button>

  <button class="zot-textable-block-view zot-top-button zot-v-alignment-button" data-value="2" data-key="verticalAlign" title="К правому краю">
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="9" y1="8" x2="15" y2="8" stroke="currentColor" stroke-width="2"/>
      <line x1="7" y1="13" x2="17" y2="13" stroke="currentColor" stroke-width="2"/>
      <line x1="5" y1="18" x2="19" y2="18" stroke="currentColor" stroke-width="2"/>
    </svg>
  </button>

  <select id="zot-radius-size-select" class="zot-callout-view  zot-small-select">
    <option>Auto</option>
    <option>10</option>
    <option>12</option>
    <option>14</option>
    <option>16</option>
    <option>18</option>
    <option>20</option>
    <option>22</option>
    <option>24</option>
    <option>26</option>
    <option>28</option>
    <option>30</option>
    <option>32</option>
    <option>34</option>
    <option>36</option>
    <option>38</option>
    <option>40</option>
  </select>

</div>

<div id="zot-callout-example" class="zot-callout-view zot-bp-example">
  <div style="
      width: 200px; 
      margin: 4px 0;
      display: flex; 
      border-radius: 10px; 
      border: 1px solid rgba(128, 128, 128, 0.2); 
      background-color: transparent; 
      padding: 12px 20px; 
      color: #dddddd; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      line-height: 1.5;
  ">
      <div style="min-width: 0px; width: 100%;">
          Example callout
      </div>
  </div>
</div>

<div id="zot-quote-example" class="zot-quote-view zot-bp-example zot-bp-hidden">
  <blockquote style="
      width: 200px; 
      margin: 4px 0;
      margin-left: 10px;
      display: flex; 
      border-left: 3px solid #dddddd; 
      padding: 2px 14px; 
      color: #dddddd; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      line-height: 1.5;
      background-color: transparent;
  ">
      <div style="min-width: 0px; width: 100%;">
          Example quote
      </div>
  </blockquote>
</div>

<div id="zot-table-example" class="zot-table-view zot-bp-example zot-bp-hidden">
  <div style="
      width: 200px;
      height: 50px;  
      margin: 4px 0;
      display: flex; 
      border-radius: 0px; 
      border: 1px solid rgba(128, 128, 128, 0.2); 
      background-color: transparent; 
      padding: 12px 20px; 
      color: #dddddd; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      line-height: 1.5;
  ">
      <div style="min-width: 0px; width: 100%;">
          Example
      </div>
  </div>
</div>

<div id="zot-divider-example" class="zot-divider-view zot-bp-example zot-bp-hidden" style="flex-direction: column; gap: 8px;">
  
  <div style="width: 100%; height: 13px; display: flex; align-items: center;">
    <div role="separator" style="width: 100%; height: 1px; background-color: rgba(128, 128, 128, 0.3);"></div>
  </div>

  <div style="width: 100%; height: 13px; display: flex; align-items: center;">
    <div role="separator" style="width: 100%; height: 1px; background-color: rgba(128, 128, 128, 0.3);"></div>
  </div>

  <div style="width: 100%; height: 13px; display: flex; align-items: center;">
    <div role="separator" style="width: 100%; height: 1px; background-color: rgba(128, 128, 128, 0.3);"></div>
  </div>

</div>

<!-- Вкладки -->
<div style="display: flex; margin-bottom: 12px; margin-top: 10px; justify-content: center; gap: 10px;">
  <button class="zot-tab zot-tab-active" data-key="Border" style="">Граница</button>
  <button class="zot-textable-block-view zot-tab" data-key="Background">Фон</button>
</div>

<div class="zot-picker-container"> 
    <div class="zot-color-picker-box" id="zot-bp-picker-box">
        <div class="zot-picker-cursor" id="zot-bp-picker-cursor"></div>
    </div>
</div>

<!-- Полоска справа -->
<div id="zot-bp-hue-slider" class="zot-hue-slider-style" style="top:337px">
  <div id="zot-bp-hue-marker" class="zot-hue-marker-style"></div>
</div>

<!-- Пресеты -->
<div style="display: flex; gap: 8px; justify-content: center; padding-top: 8px">
  <!input type="range" min="0" max="16" value="0" class="zot-slider" id="zot-opacity-slider">
  
  <div class="zot-preset-color-btn" style="background: #00bfff"></div>
  <div class="zot-preset-color-btn" id="zot-bp-last-used-preset-color-btn" style="background: #ffffff"></div>

  <input type="text" placeholder="RRGGBB" id="zot-bp-hex-input" class="zot-hex-input-style">
  <button id="zot-bp-reset-color-btn" class="zot-reset-color-btn-style" title="Сброс">Сброс</button>
  <button id="zot-bp-apply-color-btn" class="zot-apply-color-btn-style" title="Применить цвет">↑</buuton>
  </div>


<!-- Кнопка применить -->
<button id="zot-pb-apply-btn" class="zot-apply-btn-cl zot-apply-btn-cl-inactive">
  <svg width="24" height="24" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>

`;