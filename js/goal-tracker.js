/**
 * js/goal-tracker.js
 * Handles LocalStorage CRUD for user's financial goals and saved calculations.
 */

const GOALS_KEY = 'financial_goals';

function getGoals() {
    const data = localStorage.getItem(GOALS_KEY);
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch (e) {
        console.error("Failed to parse goals", e);
        return [];
    }
}

function saveGoal(type, title, targetAmount, description = "") {
    const goals = getGoals();
    const newGoal = {
        id: 'goal_' + Date.now() + Math.floor(Math.random() * 1000),
        type: type, // 'savings', 'loan', 'compound', etc.
        title: title,
        targetAmount: targetAmount,
        description: description,
        createdAt: new Date().toISOString()
    };

    goals.unshift(newGoal);
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));

    // Show Toast
    if (typeof showToast === 'function') {
        showToast("대시보드의 '나의 자산 목표'에 저장되었습니다. 📌");
    } else {
        alert("대시보드에 저장되었습니다.");
    }

    return newGoal;
}

function deleteGoal(id) {
    let goals = getGoals();
    goals = goals.filter(g => g.id !== id);
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));

    if (document.getElementById(id)) {
        const el = document.getElementById(id);
        el.style.opacity = '0';
        setTimeout(() => {
            el.remove();
            const remain = getGoals();
            if (remain.length === 0) {
                renderGoalsWidget('dashboard-goals');
            }
        }, 300);
    }
}

function renderGoalsWidget(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const goals = getGoals();

    if (goals.length === 0) {
        container.innerHTML = `
      <div class="empty-goals" style="text-align: center; padding: 40px 20px; color: rgba(255,255,255,0.4); border: 2px dashed rgba(255,255,255,0.1); border-radius: 16px;">
        <div style="font-size: 2.5rem; margin-bottom: 12px; opacity: 0.5;">📌</div>
        <div style="font-size: 0.95rem; margin-bottom: 8px;">아직 저장된 목표가 없습니다.</div>
        <div style="font-size: 0.8rem;">계산기에서 결과 화면의 <strong>"목표로 저장하기"</strong> 버튼을 눌러보세요!</div>
        <div style="margin-top: 16px;">
          <a href="savings-calculator/index.html" style="display:inline-block; padding:8px 16px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:100px; font-size:0.8rem; color:white; text-decoration:none;">적금 목표 세우기 →</a>
        </div>
      </div>
    `;
        return;
    }

    const icons = {
        'savings': '🏦',
        'compound': '📈',
        'loan': '🏠',
        'jeonse': '🏗️',
        'salary': '💼'
    };

    const html = goals.map(g => {
        const icon = icons[g.type] || '💰';
        const fmtAmount = Math.round(g.targetAmount).toLocaleString('ko-KR');

        // Convert description line breaks to br
        const cleanDesc = (g.description || "").replace(/\\n/g, '<br/>');

        return `
      <div id="${g.id}" class="goal-card" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; display: flex; align-items: flex-start; gap: 16px; transition: all 0.3s; margin-bottom: 16px;">
        <div class="goal-icon" style="flex-shrink:0; width:48px; height:48px; background:rgba(255,255,255,0.06); border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.4rem;">${icon}</div>
        <div class="goal-content" style="flex:1;">
          <h3 class="goal-title" style="font-size:1.05rem; font-weight:700; color:white; margin:0 0 4px 0;">${g.title}</h3>
          <div class="goal-amount" style="font-size:1.3rem; font-weight:800; color:var(--text-primary); margin-bottom:8px;">${fmtAmount}<span style="font-size:0.9rem;font-weight:400;color:var(--text-muted)">원</span></div>
          <p class="goal-desc" style="font-size:0.85rem; color:var(--text-secondary); margin:0; line-height:1.5;">${cleanDesc}</p>
        </div>
        <button class="goal-del-btn" onclick="deleteGoal('${g.id}')" title="삭제" style="background:none; border:none; color:rgba(255,255,255,0.3); font-size:1.2rem; cursor:pointer; padding:4px;">&times;</button>
      </div>
    `;
    }).join('');

    container.innerHTML = html;
}
