export const mainPanelHTML = `
    <button title="Таймер" class="zot-main-panel-button" style="width:44px; height:44px; padding: 0">
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 11px 9px;">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    </button>
`;

export const panelHTML = `
    <div class="zot-heading">
        Таймер
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 14px; color: #aaa; margin-bottom: 6px;">Время на учёбу</span>
        <div style="display: flex; align-items: center; gap: 4px;">
            <input type="text" value="40" id="zot-study-time-input" class="zot-hex-input-style" style="width: 40px; text-align: center;">
            <span style="font-size: 12px; color: #666;">мин.</span>
        </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 14px; color: #aaa; margin-bottom: 6px;">Время на перерыв</span>
        <div style="display: flex; align-items: center; gap: 4px;">
            <input type="text" value="10" id="zot-relax-time-input" class="zot-hex-input-style" style="width: 40px; text-align: center;">
            <span style="font-size: 12px; color: #666;">мин.</span>
        </div>
    </div>

    <div class="zot-bp-example" style="flex-direction: column; justify-content: center; align-items: center;">
        <div id="zot-timer-phase" style="font-size: 0.85rem; color: #ddd; margin-top: -4px;">Учёба</div>
        <div id="zot-timer-display" style="font-size: 3rem; font-weight: 200; color: #fff; font-family: monospace;">40:00</div>
        <div id="zot-timer-end-at" style="font-size: 0.85rem; color: #555; margin-top: -4px;">--:--</div>
    </div>
    
    <div style="display: flex; gap: 8px; justify-content: center; padding-top: 8px">
        <button id="zot-reset-timer-btn" class="zot-reset-color-btn-style" title="Сброс">Сброс</button>
        <button id="zot-anticipatorily-btn" class="zot-reset-color-btn-style" title="Досрочно" style="width: 80px">Досрочно</button>
        <button id="zot-set-timer-btn" data-value="start" class="zot-reset-color-btn-style" title="Пуск">Пуск</button>
    </div>

    <div id="zot-timer-advanced-toggle" style="font-size: 0.9rem; color: #888; cursor: pointer; user-select: none; padding: 4px 0;">▸  Дополнительно</div>

    <div id="zot-timer-advanced-content" style="display: none; flex-direction: column; gap: 10px; padding-top: 10px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.8rem; color: #aaa;">Всего на сайте:</span>
            <span id="zot-stat-total" style="font-size: 0.75rem; color: #aaa; font-family: monospace;">00:00:00</span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.8rem; color: #aaa;">Затрачено на учебу:</span>
            <span id="zot-stat-study" style="font-size: 0.75rem; color: #aaa; font-family: monospace;">00:00:00</span>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.8rem; color: #aaa;">Затрачено на отдых:</span>
            <span id="zot-stat-relax" style="font-size: 0.75rem; color: #aaa; font-family: monospace;">00:00:00</span>
        </div>
    </div>
`;
