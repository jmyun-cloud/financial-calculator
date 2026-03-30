let dsrChart = null;

function parseNumber(str) {
    if (!str) return 0;
    return parseInt(str.replace(/,/g, ''), 10) || 0;
}

function formatNumber(num) {
    return num.toLocaleString('ko-KR');
}

function formatAndCalculate(inputElem) {
    let cursorPosition = inputElem.selectionStart;
    let originalLength = inputElem.value.length;

    // Remove non-numeric characters
    let unformatted = inputElem.value.replace(/[^\d]/g, '');

    if (unformatted === '') {
        inputElem.value = '';
        calculateDSR();
        return;
    }

    // Format with commas
    let formatted = formatNumber(parseInt(unformatted, 10));
    inputElem.value = formatted;

    // Adjust cursor position
    let newLength = formatted.length;
    cursorPosition = cursorPosition + (newLength - originalLength);
    inputElem.setSelectionRange(cursorPosition, cursorPosition);

    calculateDSR();
}

function resetForm(formId) {
    document.getElementById(formId).reset();
    document.getElementById('income').value = '';
    document.getElementById('existing-debt').value = '';
    document.getElementById('new-rate').value = '';
    document.getElementById('new-term').value = '';

    calculateDSR();
}

// Calculate PMT (Monthly Payment) for amortizing loan
// P = r(PV) / (1 - (1+r)^-n) -> Actually just reverse the formula to find PV.
// PV = PMT * ( (1 - (1+r)^-n) / r )
function calculateMaxLoan(monthlyPayment, annualRate, years) {
    if (annualRate <= 0 || years <= 0 || monthlyPayment <= 0) return 0;

    const r = (annualRate / 100) / 12;
    const n = years * 12;

    // Present Value of Annuity formula
    const pv = monthlyPayment * ((1 - Math.pow(1 + r, -n)) / r);
    return Math.floor(pv);
}

function calculateDSR() {
    const income = parseNumber(document.getElementById('income').value);
    const existingDebt = parseNumber(document.getElementById('existing-debt').value);
    const newRate = parseFloat(document.getElementById('new-rate').value) || 0;
    const newTerm = parseInt(document.getElementById('new-term').value) || 0;
    const dsrLimit = parseInt(document.getElementById('dsr-limit').value) || 40;

    const resultMaxLoan = document.getElementById('result-max-loan');
    const resultDsrStatus = document.getElementById('result-dsr-status');
    const tdMaxYearly = document.getElementById('td-max-yearly-repay');
    const tdExisting = document.getElementById('td-existing-repay');
    const tdAvailable = document.getElementById('td-available-repay');

    if (income <= 0) {
        resultMaxLoan.textContent = '0원';
        resultDsrStatus.textContent = `(연소득을 입력해주세요)`;
        resultDsrStatus.style.color = 'var(--text-secondary)';
        tdMaxYearly.textContent = '0원';
        tdExisting.textContent = '- 0원';
        tdAvailable.textContent = '0원/년';
        updateChart(0, 0, income || 100);
        return;
    }

    // 1. Current DSR Analysis
    const currentDSR = (existingDebt / income) * 100;

    // 2. Regulatory Limit
    const maxYearlyDebtAllowed = Math.floor(income * (dsrLimit / 100));

    // 3. Available for New Loan
    let availableYearlyRepay = maxYearlyDebtAllowed - existingDebt;

    // 4. Calculate Maximum Loan Principal based on available repayment capacity
    let maxLoanPrincipal = 0;

    if (availableYearlyRepay > 0) {
        if (newRate > 0 && newTerm > 0) {
            // 원리금균등상환 방식 역산 (월 상환액 기준)
            const availableMonthlyRepay = availableYearlyRepay / 12;
            maxLoanPrincipal = calculateMaxLoan(availableMonthlyRepay, newRate, newTerm);
        } else {
            // 금리/기간 미입력 시 단순 예상치 (이자를 고려하지 않고 한도를 보여줄 순 없지만, 가라로 10년/4% 기준이라도?)
            // Just display 0 if rate or term is missing to force accurate input.
            maxLoanPrincipal = 0;
        }
    } else {
        availableYearlyRepay = 0;
    }

    // Format UI Text
    tdMaxYearly.textContent = formatNumber(maxYearlyDebtAllowed) + '원';
    tdExisting.textContent = '- ' + formatNumber(existingDebt) + '원';
    tdAvailable.textContent = formatNumber(availableYearlyRepay) + '원/년';

    if (availableYearlyRepay <= 0) {
        resultMaxLoan.textContent = '대출 불가';
        resultMaxLoan.style.color = 'var(--danger)';
    } else if (newRate <= 0 || newTerm <= 0) {
        resultMaxLoan.textContent = '금리/기간 입력필요';
        resultMaxLoan.style.fontSize = '2.2rem';
        resultMaxLoan.style.color = 'var(--text-secondary)';
    } else {
        // 단위 변환: 만원 단위로 보기 좋게
        if (maxLoanPrincipal >= 10000) {
            const uk = Math.floor(maxLoanPrincipal / 100000000);
            const man = Math.floor((maxLoanPrincipal % 100000000) / 10000);

            let text = '';
            if (uk > 0) text += `${formatNumber(uk)}억 `;
            if (man > 0) text += `${formatNumber(man)}만 `;
            text += '원';

            resultMaxLoan.textContent = text;
        } else {
            resultMaxLoan.textContent = formatNumber(maxLoanPrincipal) + '원';
        }
        resultMaxLoan.style.color = 'var(--primary)';
        resultMaxLoan.style.fontSize = '2.8rem';
    }

    // Warning status
    if (currentDSR >= dsrLimit) {
        resultDsrStatus.textContent = `(현재 DSR: ${currentDSR.toFixed(1)}% - 한도 초과 ⚠️)`;
        resultDsrStatus.style.color = 'var(--danger)';
        tdAvailable.style.color = 'var(--danger)';
    } else {
        resultDsrStatus.textContent = `(현재 DSR: ${currentDSR.toFixed(1)}% / 잔여 DSR: ${(dsrLimit - currentDSR).toFixed(1)}%)`;
        resultDsrStatus.style.color = 'var(--text-secondary)';
        tdAvailable.style.color = 'var(--primary)';
    }

    updateChart(existingDebt, availableYearlyRepay, income);
}

function updateChart(existing, available, totalIncome) {
    const container = document.getElementById('chart-container');
    const dsrLimit = parseInt(document.getElementById('dsr-limit').value) || 40;

    if (!totalIncome) {
        container.style.display = 'none';
        document.getElementById('legend-dsr').innerHTML = '';
        return;
    }

    container.style.display = 'block';

    // DSR Chart focuses on the Pie of the Income
    const maxRepay = totalIncome * (dsrLimit / 100);
    const safeZone = totalIncome - Math.max(existing + available, maxRepay);

    let existingPct = ((existing / totalIncome) * 100).toFixed(1);
    let availablePct = ((available / totalIncome) * 100).toFixed(1);

    if (available < 0) available = 0;

    const data = {
        labels: ['기존 대출 원리금', '추가 가능 한도', `생활비 (DSR 제외분)`],
        datasets: [{
            data: [existing, available, safeZone],
            backgroundColor: [
                '#f43f5e', // Rose 500
                '#2563eb', // Blue 600
                '#e2e8f0', // Slate 200
            ],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let val = context.raw;
                            let pct = ((val / totalIncome) * 100).toFixed(1);
                            return ` ${context.label}: ${formatNumber(val)}원 (${pct}%)`;
                        }
                    }
                }
            }
        }
    };

    const ctx = document.getElementById('chart-dsr').getContext('2d');

    if (dsrChart) {
        dsrChart.destroy();
    }

    dsrChart = new Chart(ctx, config);

    // Update Custom Legend
    const legendContainer = document.getElementById('legend-dsr');
    legendContainer.innerHTML = `
        <div class="legend-item">
            <div class="legend-dot" style="background:#f43f5e;"></div>
            <div class="legend-info">
                <span class="legend-label">기존 대출</span>
                <span class="legend-val">${existingPct}%</span>
            </div>
        </div>
        <div class="legend-item">
            <div class="legend-dot" style="background:#2563eb;"></div>
            <div class="legend-info">
                <span class="legend-label">추가 가능</span>
                <span class="legend-val">${availablePct}%</span>
            </div>
        </div>
    `;
}
