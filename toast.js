(function () {
    // Inject Toast CSS
    const style = document.createElement('style');
    style.textContent = `
        /* Toast Notification Container */
        #toast-container {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 999999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
        }

        .toast-msg {
            background-color: #1e293b;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 30px;
            font-size: 0.95rem;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 8px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .toast-msg.show {
            opacity: 1;
            transform: translateY(0);
        }

        html[data-theme="dark"] .toast-msg {
            background-color: #e2e8f0;
            color: #0f172a;
        }

        /* Copy Button Styles */
        .copy-result-btn {
            background: rgba(26, 86, 232, 0.1);
            color: var(--primary);
            border: none;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: all 0.2s;
            font-family: inherit;
        }

        .copy-result-btn:hover {
            background: var(--primary);
            color: white;
            transform: translateY(-1px);
        }

        html[data-theme="dark"] .copy-result-btn {
            background: rgba(129, 140, 248, 0.15);
            color: #818cf8;
        }
        
        html[data-theme="dark"] .copy-result-btn:hover {
            background: #818cf8;
            color: #0f172a;
        }
    `;
    document.head.appendChild(style);

    // Create Toast Container
    let toastContainer;

    function showToast(message) {
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = 'toast-msg';
        toast.innerHTML = `<span>✅</span> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        // Animate in
        // trigger reflow
        void toast.offsetWidth;
        toast.classList.add('show');

        // Remove after 2.5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300); // Wait for transition
        }, 2500);
    }

    function injectCopyButtons() {
        const resultTitles = document.querySelectorAll('.result-title, .result-header h3');

        resultTitles.forEach(titleEl => {
            // Check if already injected
            if (titleEl.querySelector('.copy-result-btn')) return;

            // Make the title flex so button sits on the right
            titleEl.style.display = 'flex';
            titleEl.style.justifyContent = 'space-between';
            titleEl.style.alignItems = 'center';

            let btnGroup = titleEl.querySelector('.result-btn-group');
            if (!btnGroup) {
                btnGroup = document.createElement('div');
                btnGroup.className = 'result-btn-group';
                btnGroup.style.display = 'flex';
                btnGroup.style.gap = '8px';
                btnGroup.style.alignItems = 'center';
                // Move any existing buttons into the group
                Array.from(titleEl.children).forEach(child => {
                    if (child.tagName === 'BUTTON') {
                        btnGroup.appendChild(child);
                    }
                });
                titleEl.appendChild(btnGroup);
            }

            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-result-btn';
            copyBtn.innerHTML = '📋 복사하기';

            copyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Find parent container (usually .result-card)
                const container = titleEl.closest('.result-card, .calc-card, .calculator-card') || titleEl.parentElement;

                // Extract inner text
                let textToCopy = container.innerText;

                // Clean up string: remove the '📋 복사하기' text itself
                textToCopy = textToCopy.replace('📋 복사하기', '').replace('🖼️ 저장', '').trim();

                // Optionally remove very redundant chart text if it litters the clipboard too much
                // For now, innerText is usually quite nice and readable as is.

                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast('계산 결과가 복사되었습니다!');
                }).catch(err => {
                    console.error('Copy failed', err);
                    showToast('복사에 실패했습니다.');
                });
            });

            // Prepend copy button so it displays before the save button
            btnGroup.insertBefore(copyBtn, btnGroup.firstChild);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectCopyButtons);
    } else {
        injectCopyButtons();
    }

    // Some calculators might rewrite the HTML including the title
    // Let's attach an observer just in case outer container gets its innerHTML replaced
    const observer = new MutationObserver((mutations) => {
        let shouldInject = false;
        for (let m of mutations) {
            if (m.type === 'childList' && m.addedNodes.length > 0) {
                shouldInject = true;
                break;
            }
        }
        if (shouldInject) injectCopyButtons();
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
