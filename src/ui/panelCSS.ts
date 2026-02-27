export const panelCSS = `
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

#zot-top-grid {
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
  border-radius: 50%; 
  border: 2px solid #444; 
  cursor: pointer;
}

#zot-floating-panel .zot-slider {
  -webkit-appearance: none !important;
  appearance: none !important;
  width: 30% !important;
  background: transparent !important;
  cursor: pointer !important;
  margin-bottom: 4px 0 !important;
  display: block !important;
}

/* Линия */
#zot-floating-panel .zot-slider::-webkit-slider-runnable-track {
  width: 100% !important;
  height: 2px !important;
  background: #666 !important;
  border-radius: 2px !important;
}

/* ползунок */
#zot-floating-panel .zot-slider::-webkit-slider-thumb {
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

#zot-floating-panel .zot-slider::-webkit-slider-thumb:hover {
  border-color: #fff !important;
  transform: scale(1.1);
}

#zot-floating-panel .zot-slider:focus {
  outline: none !important;
}

#zot-apply-btn:hover {
  background: rgba(0, 255, 170, 0.1) !important; 
  box-shadow: 
    0 0 8px rgba(0, 255, 170, 0.6),
    0 2px 4px rgba(0, 0, 0, 0.4) !important;
  transform: scale(1.03); 
}

#zot-apply-btn:active {
  transform: scale(0.96) translateY(1px); 
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5) !important; 
}

#zot-apply-btn {
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 40px; 
  height: 40px; 
  border-radius: 40%; 
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
`;

export const panelStyle = `
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