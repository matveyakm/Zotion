export const uiCSS = `

.zot-heading {
  font-size: 1.3rem; 
  font-weight: 600; 
  margin-bottom: 8px; 
  text-align: center; 
  color: #fff;
}

.zot-top-button {
  height: 36px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.3rem;
}

.zot-top-button-active {
  color: #fff;
}

.zot-alignment-button {
  align-items: center; 
  justify-content: center;
}

.zot-top-grid {
  display: grid;
  grid-template-columns: repeat(4, 40px);
  gap: 8px;
  padding: 15px;
  padding-top: 0px;
  padding-bottom: 4px;
  border-radius: 8px;
  width: max-content;
  align-items: center;
}

.zot-small-select {
  height: 36px; 
  padding: 0 8px; 
  background: #2a2a2a; 
  color: #fff; 
  border: 1px solid #444; 
  border-radius: 6px; 
  font-size: 0.9rem; 
  width: 60px;
}

.zot-tab {
  background: none; 
  border: none; 
  color: #888; 
  font-size: 1rem; 
  padding: 6px 12px; 
  cursor: pointer;
}

.zot-tab-active {
  color: #fff; 
  border-bottom: 2px solid #fff;
}

.zot-preset-color-btn {
  width: 22px; 
  height: 22px;
  border-radius: 30%; 
  border: 2px solid #444; 
  cursor: pointer;
}

#zot-text-panel .zot-slider {
  -webkit-appearance: none !important;
  appearance: none !important;
  width: 30% !important;
  background: transparent !important;
  cursor: pointer !important;
  margin-bottom: 4px 0 !important;
  display: block !important;
}

/* Линия */
#zot-text-panel .zot-slider::-webkit-slider-runnable-track {
  width: 100% !important;
  height: 2px !important;
  background: #666 !important;
  border-radius: 2px !important;
}

/* ползунок */
#zot-text-panel .zot-slider::-webkit-slider-thumb {
  -webkit-appearance: none !important;
  appearance: none !important;
  height: 10px !important;
  width: 10px !important;
  border-radius: 50% !important;
  background: #191919 !important;
  border: 2px solid #666 !important;
  margin-top: -4px !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3) !important;
  transition: border-color 0.2s, transform 0.1s !important;
}

#zot-text-panel .zot-slider::-webkit-slider-thumb:hover {
  border-color: #fff !important;
  transform: scale(1.1);
}

#zot-text-panel .zot-slider:focus {
  outline: none !important;
}

.zot-apply-btn-cl:hover {
  background: rgba(0, 255, 170, 0.1) !important; 
  box-shadow: 
    0 0 8px rgba(0, 255, 170, 0.6),
    0 2px 4px rgba(0, 0, 0, 0.4) !important;
  transform: scale(1.03); 
}

.zot-apply-btn-cl:active {
  transform: scale(0.96) translateY(1px); 
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5) !important; 
}

.zot-apply-btn-cl {
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 40px; 
  height: 40px; 
  border-radius: 40%; 
  color: #00ffaa;
  border: 1px solid #00ffaa; 
  background: rgba(0, 0, 0, 0.45);
  display: flex; 
  align-items: center; 
  justify-content: center; 
  cursor: pointer; 
  padding: 0;
  box-shadow: 
    0 0 6px rgba(0, 255, 170, 0.4), 
    0 1px 3px rgba(0, 0, 0, 0.5);
  transition: all 0.15s ease;
  outline: none;
}

.zot-apply-btn-cl-inactive {
border: 1px solid #aaaaaa;
color: #aaaaaa; 
  box-shadow: 
    0 0 6px rgba(170, 170, 170, 0.4), 
    0 1px 3px rgba(0, 0, 0, 0.5);
}

.zot-apply-btn-cl-inactive:hover {
  background: rgba(170, 170, 170, 0.1) !important; 
  box-shadow: 
    0 0 8px rgba(170, 170, 170, 0.6),
    0 2px 4px rgba(0, 0, 0, 0.4) !important;
}

.zot-hue-slider-style {
  position: absolute;
  right: 16px; 
  top: 220px; 
  width: 24px; 
  height: 120px; 
  background: linear-gradient(to bottom, 
    #ff0000 0%, 
    #ffff00 17%, 
    #00ff00 33%, 
    #00ffff 50%, 
    #0000ff 67%, 
    #ff00ff 83%, 
    #ff0000 100%
  );
  border-radius: 4px;
  overflow: visible !important;
  cursor: crosshair;
}

.zot-hue-marker-style {
  position: absolute; 
  left: -2px; /* Увеличил вылет, чтобы точно было видно */
  right: -2px; 
  top: 0%; 
  height: 3px; 
  background: #fff; 
  border: 1px solid rgba(0,0,0,0.6); 
  border-radius: 3px; 
  pointer-events: none;
  transform: translateY(-50%);
  z-index: 100; /* Выводим на передний план */
  box-shadow: 0 0 4px rgba(0,0,0,0.8); /* Добавляем тень для объема */
}

.zot-picker-container {
    text-align: center;
}

/* Основной квадрат пикера */
.zot-color-picker-box {
    position: relative;
    width: 80%; 
    height: 120px;
    padding-right: 30px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    border: 2px solid #333;
    cursor: crosshair; /* Курсор-прицел */
    
    /* БАЗОВЫЙ ЦВЕТ */
    --current-hue-color: #ff0000; 
    background-color: var(--current-hue-color);
}

/* НАСЫЩЕННОСТЬ (Горизонтальный) */
/* Слева: чистый белый */
/* Справа: прозрачный */
.zot-color-picker-box::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, #ffffff, rgba(255, 255, 255, 0));
    z-index: 1;
}

/* ЯРКОСТЬ (Вертикальный) */
/* Снизу: чистый черный */
/* Сверху: прозрачный */
.zot-color-picker-box::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, #000000, rgba(0, 0, 0, 0));
    z-index: 2;
}

/* Маркер */
.zot-picker-cursor {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0 0 4px rgba(0,0,0,0.8);
    background: transparent;
    
    top: 0%; 
    left: 100%;
    transform: translate(-50%, -50%);
    
    z-index: 10; 
    pointer-events: none;
}

.zot-reset-color-btn-style {
  width: 60px; 
  height: 24px; 
  border-radius: 5px; 
  border: 1px solid #666; 
  background: rgba(85, 85, 85, 0.7);
  display: flex; 
  align-items: center; 
  justify-content: center; 
  cursor: pointer; 
  padding: 0;
  font-size: 14px; 
}

.zot-reset-color-btn-style:hover {
  background: rgba(85, 85, 85, 0.9);
  box-shadow: 
    0 0 6px rgba(255, 255, 255, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.4);
}

.zot-reset-color-btn-style:active {
  background: rgba(85, 85, 85, 0.9);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
}

.zot-apply-color-btn-style {
  width: 24px; 
  height: 24px; 
  border-radius: 5px; 
  border: 1px solid #666; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  cursor: pointer; 
  padding: 0;
  font-size: 14px;
  color: #fff;

  -current-color: #ffffaa;
  background: var(--current-color);
}

.zot-apply-color-btn-style:hover {
  background: var(--current-color);
  box-shadow: 
    0 0 6px rgba(255, 255, 170, 0.7),
    0 2px 4px rgba(0, 0, 0, 0.4);
}

.zot-apply-color-btn-style:active {
  background: var(--current-color);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
}

.zot-hex-input-style {
  width: 60px; 
  height: 24px; 
  padding: 1px 8px; 
  background: rgba(85, 85, 85, 0.2); 
  color: #fff; 
  border: 1px solid #666; 
  border-radius: 5px; 
  font-size: 12px; 
  margin-bottom: 8px;
}

.zot-vertical-align-btn {
  height: 32px; 
  width: 32px; 
  background: #2a2a2a; 
  border: 1px solid #444; 
  color: #888; 
  border-radius: 4px; 
  cursor: pointer; 
  display: flex; align-items: center; 
  justify-content: center;
}

.zot-vertical-align-btn:hover {
  background: #2a2a2a;
  box-shadow: 
    0 0 6px rgba(255, 255, 255, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.4);
}

.zot-vertical-align-btn-active {
  color: #fff; 
}

.zot-main-panel-button {
  width: 120px; 
  height: auto; 
  border-radius: 8px; 
  border: 1px solid #444; 
  background: rgba(20, 20, 20, 0.7);
  display: flex; 
  align-items: center; 
  justify-content: center; 
  cursor: pointer; 
  padding: 8px 15px;
  font-size: 22px; 
  letter-spacing: 2px;
  font-weight: 100;
  color: #888;
}

.zot-main-panel-button:hover {
  background: rgba(90, 90, 90, 0.5);
}
  
.zot-main-panel-button-active {
   color: #fff;
}

.zot-bp-example {
  display: flex;
  width: 100%; 
  border: 1px solid rgba(128, 128, 128, 0.2); 
  padding: 20px 15px; 
  margin-top: 5px;
}

.zot-bp-hidden {
  display: none;
}
`;

export const leftPanelStyle = `
  position: fixed !important;
  left: 20px !important;
  top: calc(50vh - 240px) !important;
  width: 250px !important;
  background: #191919 !important;
  color: #d9d9d9 !important;
  padding: 16px !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.8) !important;
  z-index: 2147483647 !important;
  font-family: system-ui, -apple-system, sans-serif !important;
  transform: scale(0.9) !important;
  transform-origin: top left !important;
  display: none;
  pointer-events: auto !important;
  border: 1px solid #333 !important;
`;

export const mainPanelStyle = `
  position: fixed !important;
  left: 20px !important;
  bottom: 20px !important;
  width: 250px !important;
  background: #191919 !important;
  color: #d9d9d9 !important;
  padding: 10px !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.8) !important;
  z-index: 2147483647 !important;
  font-family: system-ui, -apple-system, sans-serif !important;
  transform: scale(0.9) !important;
  transform-origin: top left !important;
  display: none;
  pointer-events: auto !important;
  border: 1px solid #333 !important;
`;