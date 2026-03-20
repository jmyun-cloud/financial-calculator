/**
 * 금융계산기.kr - 결과 화면 이미지 저장 기능 (자동화 버전)
 *
 * [핵심 로직]
 * 1. MutationObserver를 사용하여 결과창(.result-title 등)이 나타나면 자동으로 "저장" 버튼 주입
 * 2. toast.js의 "복사하기" 버튼과 동일한 프리미엄 금융 스타일 UI 적용
 * 3. 버튼 그룹(.result-btn-group)을 통해 두 버튼이 나란히 정렬되도록 관리
 */
(function () {
  // 프리미엄 버튼 스타일 (CSS 주입)
  const style = document.createElement('style');
  style.textContent = `
    .save-image-btn, .share-result-btn {
      background: #ffffff !important;
      color: #475569 !important;
      border: 1px solid #e2e8f4 !important;
      padding: 8px 16px !important;
      border-radius: 100px !important;
      font-size: 0.82rem !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1) !important;
      font-family: inherit !important;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
      white-space: nowrap !important;
    }

    .save-image-btn:hover, .share-result-btn:hover {
      background: #f8faff !important;
      border-color: #1a56e8 !important;
      color: #1a56e8 !important;
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02) !important;
    }

    .save-image-btn:active, .share-result-btn:active {
      transform: translateY(0) !important;
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05) !important;
    }

    html[data-theme="dark"] .save-image-btn, html[data-theme="dark"] .share-result-btn {
      background: #1e293b !important;
      border-color: #334155 !important;
      color: #94a3b8 !important;
    }
    
    html[data-theme="dark"] .save-image-btn:hover, html[data-theme="dark"] .share-result-btn:hover {
      background: #2d3748 !important;
      border-color: #1a56e8 !important;
      color: #1a56e8 !important;
    }

    /* 결과 타이틀과 하단 박스 간격 조정 */
    .result-title {
      margin-bottom: 24px !important;
    }
  `;
  document.head.appendChild(style);

  /**
   * 버튼 주입 함수
   */
  function injectActionButtons() {
    // 결과창 타이틀들을 모두 찾음
    const titles = document.querySelectorAll('.result-title, .result-header h3');

    titles.forEach(titleEl => {
      if (titleEl.querySelector('.save-image-btn')) return; // 중복 방지

      // 1. 이미지 저장 버튼
      const saveBtn = document.createElement('button');
      saveBtn.className = 'save-image-btn';
      saveBtn.type = 'button';
      saveBtn.innerHTML = '🖼️ 저장';
      saveBtn.title = '결과를 이미지로 저장합니다';

      saveBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const card = titleEl.closest('.result-card, .calc-card, .calculator-card') || titleEl.parentElement;
        saveResultAsImage(card);
      });

      // 2. 결과 공유 버튼 (Web Share API)
      const shareBtn = document.createElement('button');
      shareBtn.className = 'share-result-btn';
      shareBtn.type = 'button';
      shareBtn.innerHTML = '🔗 공유';
      shareBtn.title = '결과 링크를 복사하거나 기기로 공유합니다';

      shareBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const pageName = ((document.querySelector('.main-title, h1') || {}).textContent || '금융계산기.kr').trim();
        const shareData = {
          title: pageName,
          text: `[${pageName}] 금융계산기.kr에서 쉽고 빠르게 계산한 결과를 확인해 보세요!`,
          url: window.location.href
        };

        // 스마트 폴백 로직: 모바일 환경이거나 Web Share API가 완벽지원되는 경우
        if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
          navigator.share(shareData).catch(err => {
            console.log("Share cancelled or failed: ", err);
          });
        } else {
          // 데스크탑 PC 환경 (URL 클립보드 복사)
          navigator.clipboard.writeText(window.location.href).then(() => {
            const originalText = shareBtn.innerHTML;
            shareBtn.innerHTML = '✅ 복사 완료!';
            shareBtn.style.color = '#10b981';
            shareBtn.style.borderColor = '#10b981';
            setTimeout(() => {
              shareBtn.innerHTML = originalText;
              shareBtn.style.color = '';
              shareBtn.style.borderColor = '';
            }, 2000);
          }).catch(err => {
            alert('링크 복사에 실패했습니다.');
          });
        }
      });

      // 버튼 그룹 관리 (toast.js와 공유)
      let group = titleEl.querySelector('.result-btn-group');
      if (!group) {
        group = document.createElement('div');
        group.className = 'result-btn-group';
        group.style.cssText = 'display:flex;align-items:center;gap:8px;flex-shrink:0;';

        // 타이틀을 flex로 변경
        titleEl.style.display = 'flex';
        titleEl.style.justifyContent = 'space-between';
        titleEl.style.alignItems = 'center';

        // 기존 버튼(있다면) 그룹으로 이동
        Array.from(titleEl.children).forEach(child => {
          if (child.tagName === 'BUTTON') group.appendChild(child);
        });
        titleEl.appendChild(group);
      }

      // 화면이 좁을 수 있으므로 공유버튼 먼저, 그다음 저장버튼
      group.appendChild(shareBtn);
      group.appendChild(saveBtn);
    });
  }

  /**
   * 이미지 캡처/저장 핵심 로직
   */
  function saveResultAsImage(cardElement) {
    if (!cardElement) return;
    const saveBtn = cardElement.querySelector('.save-image-btn');
    const copyBtn = cardElement.querySelector('.copy-result-btn');
    const originalText = saveBtn ? saveBtn.innerHTML : "🖼️ 저장";

    if (saveBtn) saveBtn.style.display = 'none';
    const shareBtn = cardElement.querySelector('.share-result-btn');
    if (shareBtn) shareBtn.style.display = 'none';
    if (copyBtn) copyBtn.style.display = 'none';

    const pageName = ((document.querySelector('.main-title, h1') || {}).textContent || '계산결과').trim();
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const fileName = `${pageName}_${dateStr}.png`;

    function restore() {
      if (saveBtn) { saveBtn.style.display = ''; saveBtn.innerHTML = originalText; }
      const shareBtn = cardElement.querySelector('.share-result-btn');
      if (shareBtn) shareBtn.style.display = '';
      if (copyBtn) copyBtn.style.display = '';
    }

    function doCapture() {
      html2canvas(cardElement, {
        backgroundColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#1a2435' : '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
        onclone: (doc) => {
          const cl = doc.querySelector('.result-card, .calc-card');
          if (cl) {
            const wm = doc.createElement('div');
            wm.style.cssText = "text-align:right;font-size:11px;color:#94a3b8;padding:8px 16px 2px;font-family:sans-serif;";
            wm.textContent = "💰 richcalc.kr";
            cl.appendChild(wm);
          }
        }
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');
        link.click();
        restore();
        if (saveBtn) {
          saveBtn.innerHTML = '✅ 완료!';
          setTimeout(() => { if (saveBtn) saveBtn.innerHTML = originalText; }, 2000);
        }
      }).catch(err => {
        console.error("Capture Error:", err);
        restore();
        alert("이미지 저장 중 오류가 발생했습니다.");
      });
    }

    // html2canvas 로드 확인
    if (typeof html2canvas === 'undefined') {
      const s = document.createElement('script');
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      s.onload = doCapture;
      document.head.appendChild(s);
    } else {
      doCapture();
    }
  }

  // 초기화 및 관찰 시작
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectActionButtons);
  } else {
    injectActionButtons();
  }

  const observer = new MutationObserver((mutations) => {
    let shouldInject = false;
    for (let m of mutations) {
      if (m.type === 'childList' && m.addedNodes.length > 0) {
        shouldInject = true;
        break;
      }
    }
    if (shouldInject) injectActionButtons();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 전역 노출 (하위 호환성 위해 빈 함수 유지)
  window.addSaveImageButton = function () { /* 자동화됨 */ };
  window.saveResultAsImage = saveResultAsImage;
})();
