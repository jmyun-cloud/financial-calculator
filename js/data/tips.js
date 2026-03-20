/**
 * js/data/tips.js
 * Centralized data for "Quick Tips" and "Next Steps" injected into calculators.
 */

const calculatorTips = {
    "savings-deposit": {
        title: "다음 단계: 목돈 굴리기",
        description: "예금 만기 후 이 돈을 어떻게 굴릴지 고민이신가요? 복리 수익률 계산기로 재투자 수익을 확인해보세요.",
        linkText: "복리 계산기로 이동",
        linkUrl: "compound-calculator/index.html",
        themeClass: "quick-tip",
        themeStyle: "margin-top: 24px; padding: 20px; background: rgba(5, 150, 105, 0.08); border-left: 4px solid #059669; border-radius: 8px;"
    },
    "savings-installment": {
        title: "다음 단계: 목돈 굴리기",
        description: "적금 만기 후 모인 돈을 다시 굴릴 계획이 필요합니다. 모은 돈이 복리로 얼마나 불어날지 시뮬레이션 해보세요.",
        linkText: "복리 계산기로 이동",
        linkUrl: "compound-calculator/index.html",
        themeClass: "quick-tip",
        themeStyle: "margin-top: 24px; padding: 20px; background: rgba(5, 150, 105, 0.08); border-left: 4px solid #059669; border-radius: 8px;"
    },
    "loan": {
        title: "상환 완료 후의 계획",
        description: "멋지게 상환을 마친 뒤, 대출 이자로 나가던 돈을 그대로 적금에 넣는다면 얼마가 될까요?",
        linkText: "적금 계산기로 시뮬레이션",
        linkUrl: "savings-calculator/index.html",
        themeClass: "quick-tip",
        themeStyle: "margin-top: 24px; padding: 20px; background: rgba(234, 88, 12, 0.08); border-left: 4px solid #ea580c; border-radius: 8px;"
    },
    "compound": {
        title: "효율적인 은퇴 설계",
        description: "이 시드머니로 노후를 준비한다면 국민연금과 퇴직연금을 합쳐서 매월 얼마를 받을 수 있을까요?",
        linkText: "연금 수령액 알아보기",
        linkUrl: "pension-calculator/index.html",
        themeClass: "quick-tip",
        themeStyle: "margin-top: 24px; padding: 20px; background: rgba(16, 185, 129, 0.08); border-left: 4px solid #10b981; border-radius: 8px;"
    },
    "salary": {
        title: "시작이 반이다, 실수령액 쪼개기",
        description: "월급이 통장을 스쳐가기 전에 먼저 시스템을 만드세요. 매달 일정액을 자동이체로 적금하면 얼마가 될까요?",
        linkText: "정기적금 목표 세우기",
        linkUrl: "savings-calculator/index.html",
        themeClass: "quick-tip",
        themeStyle: "margin-top: 24px; padding: 20px; background: rgba(5, 150, 105, 0.08); border-left: 4px solid #059669; border-radius: 8px;"
    },
    "severance": {
        title: "든든한 노후 방패, IRP",
        description: "퇴직금을 IRP(개인형 퇴직연금) 계좌로 이체하면 수령 시점까지 퇴직소득세를 이연받아 과세이연 효과를 누릴 수 있습니다.",
        linkText: "연금 수령액 알아보기",
        linkUrl: "pension-calculator/index.html",
        themeClass: "quick-tip",
        themeStyle: "margin-top: 24px; padding: 20px; background: rgba(217, 119, 6, 0.08); border-left: 4px solid #d97706; border-radius: 8px;"
    }
};

/**
 * Returns HTML string for the quick tip based on the tipKey.
 */
function getTipHtml(tipKey, baseDirLevel = 1) {
    const tip = calculatorTips[tipKey];
    if (!tip) return '';

    const prefix = baseDirLevel === 1 ? "../" : "../../";
    const url = prefix + tip.linkUrl;

    return `
    <div class="${tip.themeClass} fade-in" style="${tip.themeStyle}">
      <h4 style="margin: 0 0 8px 0; color: inherit; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.2rem;">💡</span> <strong>${tip.title}</strong>
      </h4>
      <p style="margin: 0 0 16px 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">
        ${tip.description}
      </p>
      <a href="${url}" class="btn-next-step" style="display: inline-flex; align-items: center; justify-content: center; padding: 10px 18px; background: var(--surface-1); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-size: 0.85rem; font-weight: 600; color: var(--text-primary); text-decoration: none; transition: all 0.2s;" onmouseover="this.style.background='var(--surface-2)';" onmouseout="this.style.background='var(--surface-1)';">
        ${tip.linkText} &rarr;
      </a>
    </div>
  `;
}

// Function to inject tip via DOM
function injectTip(containerId, tipKey, tipId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let tipEl = document.getElementById(tipId);
    if (!tipEl) {
        tipEl = document.createElement('div');
        tipEl.id = tipId;
        container.appendChild(tipEl);
    }

    tipEl.innerHTML = getTipHtml(tipKey);
}
