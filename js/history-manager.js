/* =========================================
   금융계산기.kr - History Manager
   로컬 스토리지를 이용한 최근 계산 이력 관리
   ========================================= */

'use strict';

window.HistoryManager = (function () {
    const MAX_HISTORY = 5;
    const STORAGE_KEY_PREFIX = 'calc_history_';

    /**
     * 이력 추가
     * @param {string} type - 계산기 종류 (예: 'savings', 'loan')
     * @param {object} data - 저장할 데이터 (입력값 및 결과 요약)
     */
    function save(type, data) {
        const key = STORAGE_KEY_PREFIX + type;
        let history = get(type);

        // 중복 제거 (입력값이 동일하면 최상단으로 이동시키기 위해 기존 것 삭제)
        const dataStr = JSON.stringify(data.inputs);
        history = history.filter(item => JSON.stringify(item.inputs) !== dataStr);

        // 새로운 이력 추가 (날짜 포함)
        data.timestamp = new Date().getTime();
        history.unshift(data);

        // 최대 개수 유지
        if (history.length > MAX_HISTORY) {
            history = history.slice(0, MAX_HISTORY);
        }

        localStorage.setItem(key, JSON.stringify(history));
    }

    /**
     * 이력 가져오기
     * @param {string} type 
     * @returns {Array}
     */
    function get(type) {
        const key = STORAGE_KEY_PREFIX + type;
        const data = localStorage.getItem(key);
        try {
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('History parsing error', e);
            return [];
        }
    }

    /**
     * 특정 이력 삭제
     * @param {string} type 
     * @param {number} timestamp 
     */
    function remove(type, timestamp) {
        const key = STORAGE_KEY_PREFIX + type;
        let history = get(type);
        history = history.filter(item => item.timestamp !== timestamp);
        localStorage.setItem(key, JSON.stringify(history));
    }

    /**
     * 전체 이력 삭제
     * @param {string} type 
     */
    function clear(type) {
        localStorage.removeItem(STORAGE_KEY_PREFIX + type);
    }

    return {
        save,
        get,
        remove,
        clear
    };
})();
