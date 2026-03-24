let taxChart = null;

function switchTab(tabId) {
    // Only one tab in MVP, but kept for future expansion
}

function calculateTax() {
    const grossInput = document.getElementById('t-gross').value.replace(/,/g, '');
    const gross = parseInt(grossInput) || 0;

    const expenseInput = document.getElementById('t-expense').value.replace(/,/g, '');
    const expense = parseInt(expenseInput) || 0;

    const deductionInput = document.getElementById('t-deduction').value.replace(/,/g, '');
    let deduction = parseInt(deductionInput) || 0;

    // Minimum basic deduction is usually 1,500,000 for oneself
    if (deduction === 0 && gross > 0) {
        deduction = 1500000;
        document.getElementById('t-deduction').value = '1,500,000';
    }

    const paidInput = document.getElementById('t-paid').value.replace(/,/g, '');
    const prePaidTax = parseInt(paidInput) || 0;

    if (gross <= 0) {
        alert('연간 총 수입을 입력해주세요.');
        return;
    }

    // 1. Calculate Taxable Income (과세표준)
    let taxableIncome = gross - expense - deduction;
    if (taxableIncome < 0) taxableIncome = 0;

    // 2. Apply 2026 Progressive Tax Brackets (누진세율 적용)
    let taxRate = 0;
    let progressiveDeduction = 0;

    if (taxableIncome <= 14000000) {
        taxRate = 0.06;
        progressiveDeduction = 0;
    } else if (taxableIncome <= 50000000) {
        taxRate = 0.15;
        progressiveDeduction = 1260000;
    } else if (taxableIncome <= 88000000) {
        taxRate = 0.24;
        progressiveDeduction = 5760000;
    } else if (taxableIncome <= 150000000) {
        taxRate = 0.35;
        progressiveDeduction = 15440000;
    } else if (taxableIncome <= 300000000) {
        taxRate = 0.38;
        progressiveDeduction = 19940000;
    } else if (taxableIncome <= 500000000) {
        taxRate = 0.40;
        progressiveDeduction = 25940000;
    } else if (taxableIncome <= 1000000000) {
        taxRate = 0.42;
        progressiveDeduction = 35940000;
    } else {
        taxRate = 0.45;
        progressiveDeduction = 65940000;
    }

    // 3. Calculated Base Tax (산출세액)
    let baseTax = Math.floor((taxableIncome * taxRate) - progressiveDeduction);
    if (baseTax < 0) baseTax = 0;

    // 원단위 절사
    baseTax = Math.floor(baseTax / 10) * 10;

    // 4. Local Tax (지방소득세 10%)
    let localTax = Math.floor((baseTax * 0.1) / 10) * 10;

    // 5. Total Final Tax (결정세액)
    let totalTax = baseTax + localTax;

    // 6. Expected Payment or Refund (납부/환급세액)
    let finalAmount = totalTax - prePaidTax;

    let isRefund = finalAmount < 0;
    let displayAmount = Math.abs(finalAmount);

    document.getElementById('result-tax').style.display = 'block';

    const summaryTitleHtml = isRefund ? '🎉 예상 환급액 (돌려받을 돈)' : '⚠️ 예상 납부액 (더 내야 할 돈)';
    const summaryColor = isRefund ? '#10b981' : '#e11d48';

    const summaryHtml = `
        <div style="font-size: 1.1rem; opacity: 0.9; margin-bottom: 5px; color: ${summaryColor}">${summaryTitleHtml}</div>
        <div style="font-size: 2.2rem; font-weight: 800; letter-spacing: -0.02em; color: ${summaryColor}">
            ${displayAmount.toLocaleString()}원
        </div>
        <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 10px;">
            결정된 총 세금: ${totalTax.toLocaleString()}원
        </div>
    `;
    document.getElementById('result-tax-summary').innerHTML = summaryHtml;

    // Update Result Title based on outcome
    document.getElementById('tax-result-title').innerText = isRefund ? '💰 종합소득세 환급 결과' : '💸 종합소득세 납부 결과';

    const deductionHtml = `
        <tr>
            <td>과세표준 (수입 - 경비 - 공제)</td>
            <td class="deduction-amount" style="color:var(--text-primary)">${taxableIncome.toLocaleString()}원</td>
        </tr>
        <tr>
            <td>적용 세율 구간</td>
            <td class="deduction-rate">${(taxRate * 100).toFixed(0)}% (누진공제 ${progressiveDeduction.toLocaleString()}원)</td>
        </tr>
        <tr>
            <td>종합소득세 (국세)</td>
            <td class="deduction-amount">${baseTax.toLocaleString()}원</td>
        </tr>
        <tr>
            <td>지방소득세 (지방세 10%)</td>
            <td class="deduction-amount">${localTax.toLocaleString()}원</td>
        </tr>
        <tr>
            <td>최종 결정세액 (총 내야할 세금)</td>
            <td class="deduction-amount" style="color:var(--text-primary)">${totalTax.toLocaleString()}원</td>
        </tr>
        <tr style="border-top: 1px dashed var(--border);">
            <td>기납부세액 (미리 낸 세금)</td>
            <td class="deduction-amount" style="color: #0284c7">-${prePaidTax.toLocaleString()}원</td>
        </tr>
        <tr class="deduction-total" style="border-top: 2px solid ${summaryColor};">
            <td style="color: ${summaryColor}">${isRefund ? '환급 받을 세액' : '추가 납부할 세액'}</td>
            <td class="deduction-amount" style="color: ${summaryColor}">${displayAmount.toLocaleString()}원</td>
        </tr>
    `;
    document.getElementById('deduction-table-t').innerHTML = deductionHtml;

    // Draw Chart: Comparison of Total Tax vs Pre-paid Tax if prePaidTax > 0, else just Total Tax
    let chartLabel1, chartValue1, chartLabel2, chartValue2;
    if (prePaidTax > 0) {
        if (isRefund) {
            chartLabel1 = '결정세액 (내야할 돈)'; chartValue1 = totalTax;
            chartLabel2 = '환급액 (돌려받을 돈)'; chartValue2 = displayAmount;
        } else {
            chartLabel1 = '추가 납부액'; chartValue1 = displayAmount;
            chartLabel2 = '기납부세액 (이미 낸 돈)'; chartValue2 = prePaidTax;
        }
        drawChart('chart-tax', 'legend-tax', chartLabel1, chartValue1, chartLabel2, chartValue2, isRefund);
    } else {
        document.getElementById('chart-tax').style.display = 'none';
        document.getElementById('legend-tax').innerHTML = '<div style="text-align:center; color: var(--text-muted); font-size: 0.85rem;">기납부세액이 없어 차트가 생략되었습니다.</div>';
    }

    // Track Feature
    if (typeof gtag !== "undefined") {
        gtag('event', 'calculate', {
            'event_category': 'Global Income Tax',
            'event_label': isRefund ? 'Refund' : 'Pay',
            'value': displayAmount
        });
    }

    document.getElementById('result-tax').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function drawChart(canvasId, legendId, label1, value1, label2, value2, isRefund) {
    document.getElementById(canvasId).style.display = 'block';
    const ctx = document.getElementById(canvasId).getContext('2d');

    if (taxChart) {
        taxChart.destroy();
    }

    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    const color1 = isRefund ? '#94a3b8' : '#e11d48'; // Gray vs Red
    const color2 = isRefund ? '#10b981' : '#0284c7'; // Green vs Blue

    taxChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [label1, label2],
            datasets: [{
                data: [value1, value2],
                backgroundColor: [color1, color2],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let val = context.raw || 0;
                            return ' ' + val.toLocaleString() + '원';
                        }
                    }
                }
            }
        }
    });

    const legendHtml = `
        <div class="legend-item">
            <span class="legend-color" style="background:${color1}"></span>
            <span class="legend-label">${label1}</span>
            <span class="legend-value">${value1.toLocaleString()}원</span>
        </div>
        <div class="legend-item">
            <span class="legend-color" style="background:${color2}"></span>
            <span class="legend-label">${label2}</span>
            <span class="legend-value" style="color: ${isRefund ? '#10b981' : 'inherit'}">${value2.toLocaleString()}원</span>
        </div>
    `;
    document.getElementById(legendId).innerHTML = legendHtml;
}
