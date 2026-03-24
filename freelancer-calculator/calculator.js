let freelancerChart = null;

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });

    const activeBtn = document.getElementById(`tab-${tabId}`);
    const activePanel = document.getElementById(`panel-${tabId}`);

    if (activeBtn && activePanel) {
        activeBtn.classList.add('active');
        activeBtn.setAttribute('aria-selected', 'true');
        activePanel.classList.add('active');
    }
}

function calculateFreelancer() {
    const grossInput = document.getElementById('f-gross').value.replace(/,/g, '');
    const gross = parseInt(grossInput) || 0;

    if (gross <= 0) {
        alert('세전 총 수입을 입력해주세요.');
        return;
    }

    // 3% 국세 (사업소득세) - 원단위 절사
    const incomeTax = Math.floor((gross * 0.03) / 10) * 10;

    // 0.3% 지방세 (지방소득세) - 원단위 절사
    const localTax = Math.floor((incomeTax * 0.1) / 10) * 10;

    const totalTax = incomeTax + localTax;
    const net = gross - totalTax;

    document.getElementById('result-freelancer').style.display = 'block';

    const summaryHtml = `
        <div style="font-size: 1.1rem; opacity: 0.9; margin-bottom: 5px;">예상 실수령액</div>
        <div style="font-size: 2.2rem; font-weight: 800; letter-spacing: -0.02em;">
            ${net.toLocaleString()}원
        </div>
        <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 10px;">
            세전 금액: ${gross.toLocaleString()}원
        </div>
    `;
    document.getElementById('result-freelancer-summary').innerHTML = summaryHtml;

    const deductionHtml = `
        <tr>
            <td>사업소득세 (국세 3%)</td>
            <td class="deduction-amount">${incomeTax.toLocaleString()}원</td>
        </tr>
        <tr>
            <td>지방소득세 (지방세 0.3%)</td>
            <td class="deduction-amount">${localTax.toLocaleString()}원</td>
        </tr>
        <tr class="deduction-total">
            <td>총 공제 세액 (3.3%)</td>
            <td class="deduction-amount">${totalTax.toLocaleString()}원</td>
        </tr>
    `;
    document.getElementById('deduction-table-f').innerHTML = deductionHtml;

    drawChart('chart-freelancer', 'legend-freelancer', '실수령액', net, '총 공제 세액 (3.3%)', totalTax);

    // Track Feature
    if (typeof gtag !== "undefined") {
        gtag('event', 'calculate', {
            'event_category': 'Freelancer Tax',
            'event_label': 'Gross to Net',
            'value': gross
        });
    }

    document.getElementById('result-freelancer').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function calculateReverse() {
    const netInput = document.getElementById('r-net').value.replace(/,/g, '');
    const net = parseInt(netInput) || 0;

    if (net <= 0) {
        alert('입금된 실수령액을 입력해주세요.');
        return;
    }

    // 역산 로직 (net = gross - gross*0.033) => gross = net / 0.967
    // 원단위 절사 등의 정확한 역산을 위해 반올림하여 10원 단위로 맞춤 (한국 세금 역산 관행)
    let gross = Math.round((net / 0.967) / 10) * 10;

    // 검증: 도출된 gross로 다시 3.3% 계산했을 때 net이 맞는지 확인
    let incomeTax = Math.floor((gross * 0.03) / 10) * 10;
    let localTax = Math.floor((incomeTax * 0.1) / 10) * 10;
    let totalTax = incomeTax + localTax;

    // 1원 차이 등에 대한 미세조정 루프 (역산의 꽃)
    let diff = net - (gross - totalTax);
    if (diff !== 0) {
        gross += diff; // 오차만큼 보정 시도
        incomeTax = Math.floor((gross * 0.03) / 10) * 10;
        localTax = Math.floor((incomeTax * 0.1) / 10) * 10;
        totalTax = incomeTax + localTax;
    }

    document.getElementById('result-reverse').style.display = 'block';

    const summaryHtml = `
        <div style="font-size: 1.1rem; opacity: 0.9; margin-bottom: 5px;">원래 세전 계약금액</div>
        <div style="font-size: 2.2rem; font-weight: 800; letter-spacing: -0.02em;">
            ${gross.toLocaleString()}원
        </div>
        <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 10px;">
            실수령액: ${net.toLocaleString()}원
        </div>
    `;
    document.getElementById('result-reverse-summary').innerHTML = summaryHtml;

    const deductionHtml = `
        <tr class="take-home-row">
            <td>세전 계약금액 (100%)</td>
            <td class="deduction-amount">${gross.toLocaleString()}원</td>
        </tr>
        <tr>
            <td>사업소득세 (국세 3%)</td>
            <td class="deduction-amount" style="color:var(--danger)">-${incomeTax.toLocaleString()}원</td>
        </tr>
        <tr>
            <td>지방소득세 (지방세 0.3%)</td>
            <td class="deduction-amount" style="color:var(--danger)">-${localTax.toLocaleString()}원</td>
        </tr>
        <tr class="deduction-total">
            <td>실수령액 (96.7%)</td>
            <td class="deduction-amount" style="color:var(--text-primary)">${(gross - totalTax).toLocaleString()}원</td>
        </tr>
    `;
    document.getElementById('deduction-table-r').innerHTML = deductionHtml;

    // Track Feature
    if (typeof gtag !== "undefined") {
        gtag('event', 'calculate', {
            'event_category': 'Freelancer Tax',
            'event_label': 'Reverse Net to Gross',
            'value': net
        });
    }

    document.getElementById('result-reverse').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function drawChart(canvasId, legendId, label1, value1, label2, value2) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    if (freelancerChart) {
        freelancerChart.destroy();
    }

    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDarkMode ? '#e2e8f0' : '#475569';
    const color1 = '#8b5cf6'; // Primary Purple
    const color2 = '#ec4899'; // Danger Pink

    freelancerChart = new Chart(ctx, {
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

    // Custom Legend
    const legendHtml = `
        <div class="legend-item">
            <span class="legend-color" style="background:${color1}"></span>
            <span class="legend-label">${label1}</span>
            <span class="legend-value">${value1.toLocaleString()}원</span>
        </div>
        <div class="legend-item">
            <span class="legend-color" style="background:${color2}"></span>
            <span class="legend-label">${label2}</span>
            <span class="legend-value">${value2.toLocaleString()}원</span>
        </div>
    `;
    document.getElementById(legendId).innerHTML = legendHtml;
}
