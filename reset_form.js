(function () {
  const style = document.createElement("style");
  style.textContent = `
        .action-buttons {
            display: flex;
            gap: 12px;
            width: 100%;
            margin-top: 24px; /* default reasonable spacing */
        }
        .action-buttons .calc-btn {
            flex: 1 1 auto;
            margin: 0 !important;
        }
        .reset-btn {
            flex: 0 0 auto;
            padding: 16px 20px;
            background: var(--surface-2);
            color: var(--text-secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            font-family: inherit;
            font-size: 1.05rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all var(--transition);
        }
        .reset-btn:hover {
            background: var(--border);
            color: var(--text-primary);
            transform: translateY(-2px);
        }
        .reset-btn:active {
            transform: translateY(0);
        }
        
        /* Dark Mode */
        html[data-theme="dark"] .reset-btn {
            background: var(--surface);
            border-color: var(--border);
            color: var(--text-secondary);
        }
        html[data-theme="dark"] .reset-btn:hover {
            background: var(--surface-2);
            color: var(--text-primary);
        }
    `;
  document.head.appendChild(style);

  function injectResetButtons() {
    const calcBtns = document.querySelectorAll(".calc-btn");
    calcBtns.forEach((btn) => {
      const parent = btn.parentElement;
      if (parent.classList.contains("action-buttons")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "action-buttons";

      // Replicate any inline or computed margin top purely if we want perfectly identical,
      // but usually setting margin-top 24px is clean. Let's just remove margin top from calc-btn
      const currentMarginTop = window.getComputedStyle(btn).marginTop;
      if (currentMarginTop && currentMarginTop !== "0px") {
        wrapper.style.marginTop = currentMarginTop;
      } else {
        // If it had no margin, we might not want to force 24px if the parent handled it,
        // so we can just let it inherit or keep 0
        wrapper.style.marginTop = "0";
      }
      btn.style.marginTop = "0";

      parent.insertBefore(wrapper, btn);
      wrapper.appendChild(btn);

      const resetBtn = document.createElement("button");
      resetBtn.className = "reset-btn";
      resetBtn.innerHTML = '<span class="btn-icon">↺</span> 초기화';
      resetBtn.type = "button";

      resetBtn.addEventListener("click", () => {
        let scope = btn.closest(".tab-panel");
        if (!scope) {
          scope = btn.closest(".calc-card")?.parentElement || document.body;
        }

        // Clear text inputs, but ignore the live rate inputs on the exchange calculator
        scope
          .querySelectorAll(
            'input[type="text"], input[type="number"], input[inputmode="numeric"]',
          )
          .forEach((input) => {
            if (input.classList.contains("live-rate")) return;
            input.value = "";
            input.dispatchEvent(new Event("input", { bubbles: true }));
          });

        // Hide result cards
        scope.querySelectorAll(".result-card").forEach((card) => {
          card.style.display = "none";
        });

        // Remove custom error borders nicely
        scope.querySelectorAll(".error").forEach((err) => {
          err.classList.remove("error");
        });
      });

      wrapper.insertBefore(resetBtn, btn);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectResetButtons);
  } else {
    injectResetButtons();
  }
})();
