(function () {
    // Utility to format number into Korean units (만, 억, 조)
    function numberToKorean(numberStr) {
        // Remove non-numeric characters (commas, etc.)
        const numText = numberStr.replace(/[^0-9]/g, '');
        if (!numText) return '';

        const num = parseInt(numText, 10);
        if (isNaN(num) || num === 0) return '';

        const units = ['', '만', '억', '조', '경'];
        let res = '';
        let n = num;
        let unitIndex = 0;

        while (n > 0) {
            const chunk = n % 10000;
            if (chunk > 0) {
                const formattedChunk = chunk.toLocaleString('ko-KR');
                res = formattedChunk + units[unitIndex] + (res ? ' ' + res : '');
            }
            n = Math.floor(n / 10000);
            unitIndex++;
        }

        return res + ' 원';
    }

    function initCurrencyHelper() {
        // Find inputs that represent money (usually adjacent to <span class="input-unit">원</span>)
        const moneyInputs = [];
        const units = document.querySelectorAll('.input-unit');
        units.forEach(unit => {
            if (unit.textContent.includes('원')) {
                const wrap = unit.closest('.input-wrap');
                if (wrap) {
                    const input = wrap.querySelector('input[type="text"], input[type="number"], input[inputmode="numeric"]');
                    if (input) moneyInputs.push(input);
                }
            }
        });

        // Deduplicate
        const uniqueInputs = [...new Set(moneyInputs)];

        uniqueInputs.forEach(input => {
            const wrap = input.closest('.input-wrap');
            if (!wrap) return;

            // Check if there's already a hint we can hijack or append ours
            let helperDiv = wrap.parentNode.querySelector('.currency-helper-text');
            if (!helperDiv) {
                helperDiv = document.createElement('div');
                helperDiv.className = 'currency-helper-text';

                // Styling
                helperDiv.style.fontSize = '0.85rem';
                helperDiv.style.color = 'var(--primary)'; // Will be blue in light, adjusted in dark mode via CSS
                helperDiv.style.marginTop = '4px';
                helperDiv.style.minHeight = '18px';
                helperDiv.style.fontWeight = '600';
                helperDiv.style.transition = 'opacity 0.2s';
                helperDiv.style.opacity = '0';

                // Add class hooks for dark mode overrides
                helperDiv.classList.add('ko-currency-hint');

                // Insert immediately after the .input-wrap
                wrap.parentNode.insertBefore(helperDiv, wrap.nextSibling);

                // Add CSS for dark mode handling of this element globally
                const darkStyle = document.createElement('style');
                darkStyle.textContent = `
                    html[data-theme="dark"] .ko-currency-hint {
                        color: #818cf8 !important;
                    }
                `;
                // Only append once
                if (!document.getElementById('ko-currency-style')) {
                    darkStyle.id = 'ko-currency-style';
                    document.head.appendChild(darkStyle);
                }
            }

            const updateHelper = () => {
                const val = input.value;
                const kor = numberToKorean(val);
                if (kor) {
                    helperDiv.textContent = kor;
                    helperDiv.style.opacity = '1';
                } else {
                    helperDiv.style.opacity = '0';
                }
            };

            // Listen to input events
            input.addEventListener('input', updateHelper);

            // Also update on focus/blur or initial load if there's predefined value
            if (input.value) updateHelper();
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCurrencyHelper);
    } else {
        initCurrencyHelper();
    }
})();
