(function () {
    function animateValue(obj, targetStr) {
        // Extract basic structure: prefix, suffix, and the number
        const isNegative = targetStr.includes('−') || targetStr.includes('-');
        const isPositiveMatch = targetStr.includes('+');
        const numMatch = targetStr.replace(/[^0-9.]/g, '');

        if (!numMatch) return;

        const targetNum = parseFloat(numMatch);
        if (isNaN(targetNum) || targetNum === 0) return;

        // Ensure we don't accidentally animate things like dates or percentages that don't make sense
        // Wait, percentages are fine, but dates are not. Our classes are mostly monetary.
        // Let's preserve the exact suffix.
        const prefix = isNegative ? '−' : (isPositiveMatch ? '+' : '');
        // remove prefix signs, digits, commas, dots, and spaces from suffix
        const suffix = targetStr.replace(/[0-9.,\-−+ ]/g, '');

        let startTimestamp = null;
        const duration = 600; // 0.6 seconds

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // easeOutExpo for very snappy start and slow end
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentNum = easeProgress * targetNum;

            // Decide if we should show decimals or not based on targetNum
            const isFloat = targetNum % 1 !== 0;
            const formatted = isFloat
                ? currentNum.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : Math.round(currentNum).toLocaleString('ko-KR');

            obj.textContent = prefix + formatted + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.textContent = targetStr; // Force exact end state
                // Allow re-animation in future
                setTimeout(() => obj.removeAttribute('data-animating'), 50);
            }
        };

        obj.setAttribute('data-animating', 'true');
        window.requestAnimationFrame(step);
    }

    function initGlobalCountUp() {
        // Classes of elements that should be animated
        const targetClasses = ['summary-amount', 'result-item-value', 'amount', 'cr-value'];

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check node itself
                            const isTarget = targetClasses.some(cls => node.classList && node.classList.contains(cls));
                            if (isTarget && !node.hasAttribute('data-animating')) {
                                const text = node.textContent.trim();
                                if (text) animateValue(node, text);
                            }

                            // Check descendants
                            if (node.querySelectorAll) {
                                targetClasses.forEach(cls => {
                                    const descendants = node.querySelectorAll('.' + cls);
                                    descendants.forEach(child => {
                                        if (!child.hasAttribute('data-animating')) {
                                            const text = child.textContent.trim();
                                            if (text) animateValue(child, text);
                                        }
                                    });
                                });
                            }
                        }
                    });
                } else if (mutation.type === 'characterData' || mutation.type === 'attributes') {
                    // Usually innerHTML replaces nodes entirely, but occasionally textContent is set
                    let targetElement = mutation.type === 'characterData' ? mutation.target.parentElement : mutation.target;

                    if (targetElement && targetElement.nodeType === Node.ELEMENT_NODE) {
                        const isTarget = targetClasses.some(cls => targetElement.classList.contains(cls));
                        if (isTarget && !targetElement.hasAttribute('data-animating')) {
                            const text = targetElement.textContent.trim();
                            if (text) animateValue(targetElement, text);
                        }
                    }
                }
            });
        });

        // Observe the body or specific containers
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            // also observe class changes if needed, but not strictly necessary
        });

        // Initial scan for elements already present on load
        targetClasses.forEach(cls => {
            document.querySelectorAll('.' + cls).forEach(el => {
                if (!el.hasAttribute('data-animating')) {
                    const text = el.textContent.trim();
                    if (text && text !== '0원' && text !== '0' && text !== '-') {
                        animateValue(el, text);
                    }
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlobalCountUp);
    } else {
        initGlobalCountUp();
    }
})();
