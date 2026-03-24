/**
 * js/data/calculators.js
 * Centralized data for all financial calculators in the platform.
 * Used for dynamic rendering of the dashboard and other lists.
 */

const calculatorCategories = [
    {
        categoryTitle: "투자 및 저축",
        calculators: [
            {
                id: "savings",
                path: "savings-calculator/index.html",
                themeType: "card-blue", // CSS var class
                icon: "🏦",
                title: "예적금 만기 계산기",
                description: "예금과 적금의 만기 수령액을 계산합니다. 단리·복리, 세금 3종을 선택할 수 있습니다.",
                tags: ["단리/월복리", "이자소득세", "도넛 차트"]
            },
            {
                id: "compound",
                path: "compound-calculator/index.html",
                themeType: "card-green",
                icon: "📈",
                title: "복리 수익률 계산기",
                description: "투자 원금과 기대 수익률로 복리 효과를 계산합니다. 월 추가투자, 72의 법칙, 성장 그래프를 제공합니다.",
                tags: ["복리 vs 단리", "월 추가투자", "72의 법칙"]
            },
            {
                id: "tax-interest",
                path: "tax-interest-calculator/index.html",
                themeType: "card-amber",
                icon: "💸",
                title: "세후 이자 계산기",
                description: "이자소득세(15.4%), 세금우대(9.9%), 비과세 3가지 유형을 동시에 비교해 세후 실수령 이자를 계산합니다.",
                tags: ["일반 15.4%", "세금우대 9.9%", "비과세 0%"]
            }
        ]
    },
    {
        categoryTitle: "대출 및 부동산",
        calculators: [
            {
                id: "loan",
                path: "loan-calculator/index.html",
                themeType: "card-orange",
                icon: "🏠",
                title: "대출 이자 계산기",
                description: "주택담보·신용대출의 월 상환금과 총 이자를 원리금균등·원금균등·만기일시 방식으로 계산합니다.",
                tags: ["원리금균등", "원금균등", "만기일시", "상환 스케줄"]
            },
            {
                id: "jeonse",
                path: "jeonse-calculator/index.html",
                themeType: "card-purple",
                icon: "🏗️",
                title: "전세/월세 전환 계산기",
                description: "전세금을 월세로, 월세를 전세로 전환할 때 적정 금액을 계산합니다. 법정 전월세 전환율(연 6%) 기준.",
                tags: ["전세→월세", "월세→전세", "보증금 조정"]
            }
        ]
    },
    {
        categoryTitle: "생활 및 연봉/연금",
        calculators: [
            {
                id: "salary",
                path: "salary-calculator/index.html",
                themeStyle: "--card-color: #059669;",
                icon: "💼",
                title: "연봉 계산기",
                description: "세전 연봉을 입력하면 4대보험·소득세를 자동 계산하여 월 실수령액을 즉시 확인합니다. 시급 변환도 지원합니다.",
                tags: ["4대보험", "소득세", "시급→월급", "부양가족 반영"]
            },
            {
                id: "freelancer",
                path: "freelancer-calculator/index.html",
                themeStyle: "--card-color: #8b5cf6;",
                icon: "💸",
                title: "프리랜서 계산기",
                description: "알바, N잡러의 3.3% 원천징수 세금을 떼고 남은 정확한 실수령액을 구하거나, 입금액으로 세전 역산을 지원합니다.",
                tags: ["3.3% 공제", "종합소득세", "실수령액 역산", "사업소득"]
            },
            {
                id: "globaltax",
                path: "global-tax-calculator/index.html",
                themeStyle: "--card-color: #e11d48;",
                icon: "📑",
                title: "종합소득세 계산기",
                description: "프리랜서, 소규모 개인사업자를 위해 최신 2026 누진세율(6%~45%)을 적용하여 5월 예상세액(납부/환급)을 계산합니다.",
                tags: ["5월 종소세", "누진세율", "예상 환급액", "기납부세액"]
            },
            {
                id: "severance",
                path: "severance-calculator/index.html",
                themeStyle: "--card-color: #d97706;",
                icon: "📦",
                title: "퇴직금 계산기",
                description: "입사일·퇴직일과 평균임금 입력으로 퇴직금·퇴직소득세·실수령액을 계산합니다. DB형/DC형 비교도 지원합니다.",
                tags: ["퇴직소득세", "근속연수공제", "DB/DC형 비교"]
            },
            {
                id: "pension",
                path: "pension-calculator/index.html",
                themeType: "card-sky",
                icon: "👴",
                title: "연금 수령액 계산기",
                description: "국민연금 예상 수령액, 퇴직연금, 개인연금을 계산하고 노후 필요 생활비와 비교합니다.",
                tags: ["국민연금", "퇴직연금", "개인연금", "통합 분석"]
            },
            {
                id: "inflation",
                path: "inflation-calculator/index.html",
                themeType: "card-red",
                icon: "📊",
                title: "물가상승률 계산기",
                description: "인플레이션이 자산 가치에 미치는 영향을 계산합니다. 미래 필요금액, 구매력, 실질 수익률을 확인하세요.",
                tags: ["미래 가치", "구매력 감소", "실질 수익률"]
            },
            {
                id: "exchange",
                path: "exchange-calculator/index.html",
                themeType: "card-cyan",
                icon: "💱",
                title: "환율 계산기",
                description: "원화와 5개 주요 통화를 환산합니다. 환전 수수료 우대율을 적용한 실제 환전 금액도 계산합니다.",
                tags: ["주요 6개국", "수수료 계산", "우대율 적용"]
            }
        ]
    }
];

function renderCalculatorGrid(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = '';

    calculatorCategories.forEach(category => {
        html += `<div class="toolbox-category"><h3 class="toolbox-category-title">${category.categoryTitle}</h3><div class="calc-grid">`;

        category.calculators.forEach(calc => {
            const themeAttr = calc.themeType ? `class="calc-card reveal ${calc.themeType}"` : `class="calc-card reveal" style="${calc.themeStyle}"`;
            const tagsHtml = calc.tags.map(tag => `<span class="card-tag">${tag}</span>`).join('');

            html += `
        <a href="${calc.path}" ${themeAttr}>
          <div class="calc-card-glow"></div>
          <div class="card-icon-wrap">${calc.icon}</div>
          <div class="card-title">${calc.title}</div>
          <div class="card-desc">${calc.description}</div>
          <div class="card-features">${tagsHtml}</div>
          <div class="card-arrow">→</div>
        </a>
      `;
        });

        html += `</div></div>`;
    });

    container.innerHTML = html;
}
