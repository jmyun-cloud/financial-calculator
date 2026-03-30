let subChart = null;

function resetForm(formId) {
    document.getElementById(formId).reset();
    calculatePoints();
}

function calculatePoints() {
    const homelessPts = parseInt(document.getElementById('t-homeless').value) || 0;
    const familyPts = parseInt(document.getElementById('t-family').value) || 0;
    const bankPts = parseInt(document.getElementById('t-bank').value) || 0;

    const totalPts = homelessPts + familyPts + bankPts;

    // Build deduction / score table
    const homelessLabel = document.getElementById('t-homeless').options[document.getElementById('t-homeless').selectedIndex].text.split('(')[0].trim();
    const familyLabel = document.getElementById('t-family').options[document.getElementById('t-family').selectedIndex].text.split('(')[0].trim();
    const bankLabel = document.getElementById('t-bank').options[document.getElementById('t-bank').selectedIndex].text.split('(')[0].trim();

    const tableHtml = `
        <tr>
            <td>무주택기간 <strong>[${homelessLabel}]</strong></td>
            <td class="deduction-amount" style="color:var(--primary)">${homelessPts}점</td>
        </tr>
        <tr>
            <td>부양가족 수 <strong>[${familyLabel}]</strong></td>
            <td class="deduction-amount" style="color:var(--primary)">${familyPts}점</td>
        </tr>
        <tr>
            <td>청약통장 가입기간 <strong>[${bankLabel}]</strong></td>
            <td class="deduction-amount" style="color:var(--primary)">${bankPts}점</td>
        </tr>
        <tr class="deduction-total">
            <td>총 청약 가점 (84점 만점)</td>
            <td class="deduction-amount" style="color:var(--primary)">${totalPts}점</td>
        </tr>
    `;

    document.getElementById('score-table-t').innerHTML = tableHtml;

    // Update main display
    const counterElement = document.getElementById('result-total-score');
    if (typeof countUp !== 'undefined') {
        countUp(counterElement, totalPts, 0, 500, '점');
    } else {
        counterElement.innerText = totalPts + '점';
    }

    drawChart('chart-subscription', 'legend-subscription', totalPts);

    // Track Feature
    if (typeof gtag !== "undefined") {
        gtag('event', 'calculate', {
            'event_category': 'Housing Subscription',
            'event_label': 'Total Score',
            'value': totalPts
        });
    }
}

function drawChart(canvasId, legendId, score) {
    document.getElementById('chart-container').style.display = 'block';
    const ctx = document.getElementById(canvasId).getContext('2d');

    if (subChart) {
        subChart.destroy();
    }

    const missingPts = 84 - score;
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#0d9488';

    // Evaluate message based on score
    let message = "가점이 낮습니다.";
    if (score >= 60) message = "당첨 안정권에 근접했습니다!";
    else if (score >= 50) message = "인기 평형 당첨을 노려볼 만합니다.";
    else if (score >= 40) message = "추첨제 물량을 함께 노리세요.";

    subChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['내 가점', '부족한 점수'],
            datasets: [{
                data: [score, missingPts],
                backgroundColor: [primaryColor, 'rgba(148, 163, 184, 0.2)'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return ' ' + context.raw + '점';
                        }
                    }
                }
            }
        },
        plugins: [{
            id: 'textCenter',
            beforeDraw: function (chart) {
                var width = chart.width,
                    height = chart.height,
                    ctx = chart.ctx;

                ctx.restore();
                var fontSize = (height / 8).toFixed(2);
                ctx.font = "bold " + fontSize + "px Pretendard";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillStyle = primaryColor;

                var text = score + "점",
                    textX = width / 2,
                    textY = height / 2;

                ctx.fillText(text, textX, textY);

                // Small subtext
                ctx.font = "500 " + (height / 18).toFixed(2) + "px Pretendard";
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#64748b';
                ctx.fillText(message, textX, textY + parseInt(fontSize));

                ctx.save();
            }
        }]
    });

    const legendHtml = `
        <div class="legend-item" style="padding: 10px 15px; background: rgba(13, 148, 136, 0.1); border-radius: 100px;">
            <span class="legend-label" style="font-weight:700; color:${primaryColor}">💡 84점 만점 중 ${score}점 획득</span>
        </div>
    `;
    document.getElementById(legendId).innerHTML = legendHtml;
}
