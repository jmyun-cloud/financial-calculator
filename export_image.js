/**
 * 금융계산기.kr - 결과 화면 이미지 저장 기능
 *
 * [포지셔닝 전략]
 * toast.js 가 .result-title 에 display:flex + justifyContent:space-between 을 설정하고
 * 그 안에 .copy-result-btn 을 appendChild 합니다.
 * 세 개의 flex 아이템(타이틀 텍스트, 복사버튼, 저장버튼)이 생기면 space-between 에 의해
 * 서로 떨어져서 나타나는 문제가 발생합니다.
 *
 * 해결책: 복사하기 + 저장 버튼을 하나의 .result-btn-group div 로 묶어서
 * flex 아이템이 [타이틀 텍스트] / [버튼 그룹] 두 개만 되도록 합니다.
 */
(function () {
  function addSaveImageButton(resultCardId) {
    var card = document.getElementById(resultCardId);
    if (!card) return;
    if (card.querySelector(".save-image-btn")) return;

    var btn = document.createElement("button");
    btn.className = "save-image-btn";
    btn.type = "button";
    btn.innerHTML = "🖼️ 저장";
    btn.title = "계산 결과를 이미지로 저장합니다";
    btn.addEventListener("click", function () {
      saveResultAsImage(card);
    });

    var titleEl = card.querySelector(".result-title");
    if (!titleEl) {
      card.insertBefore(btn, card.firstChild);
      return;
    }

    // toast.js 가 이미 실행되어 copy 버튼이 있으면 → 함께 그룹으로 묶기
    var copyBtn = titleEl.querySelector(".copy-result-btn");
    if (copyBtn) {
      var existingGroup = titleEl.querySelector(".result-btn-group");
      if (!existingGroup) {
        // 새 그룹 div 생성
        var group = document.createElement("div");
        group.className = "result-btn-group";
        group.style.cssText = "display:flex;align-items:center;gap:6px;flex-shrink:0;";
        // copy 버튼을 그룹 안으로 이동
        titleEl.insertBefore(group, copyBtn);
        group.appendChild(copyBtn);
        group.appendChild(btn);
      } else {
        existingGroup.appendChild(btn);
      }
    } else {
      // toast.js 보다 먼저 실행된 경우 - 그냥 append (나중에 toast.js 가 flex 처리)
      if (getComputedStyle(titleEl).display !== "flex") {
        titleEl.style.display = "flex";
        titleEl.style.justifyContent = "space-between";
        titleEl.style.alignItems = "center";
      }
      titleEl.appendChild(btn);
    }
  }

  function saveResultAsImage(cardElement) {
    var card = cardElement;
    var btn = card.querySelector(".save-image-btn");
    var copyBtn = card.querySelector(".copy-result-btn");
    var originalText = btn ? btn.innerHTML : "";

    // 버튼 숨기기 (캡처 제외)
    if (btn) btn.style.display = "none";
    if (copyBtn) copyBtn.style.display = "none";

    var pageName =
      ((document.querySelector(".main-title, h1") || {}).textContent || "계산결과").trim();
    var now = new Date();
    var dateStr =
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");
    var fileName = pageName + "_" + dateStr + ".png";

    function restore() {
      if (btn) { btn.style.display = ""; btn.innerHTML = originalText; }
      if (copyBtn) copyBtn.style.display = "";
    }

    function doCapture() {
      html2canvas(card, {
        backgroundColor:
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "#1a2435"
            : "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        onclone: function (doc) {
          var cl = doc.querySelector(".result-card");
          if (cl) {
            var wm = doc.createElement("div");
            wm.style.cssText =
              "text-align:right;font-size:11px;color:#94a3b8;padding:6px 16px 2px;font-family:sans-serif;";
            wm.textContent = "💰 richcalc.kr";
            cl.appendChild(wm);
          }
        },
      })
        .then(function (canvas) {
          var link = document.createElement("a");
          link.download = fileName;
          link.href = canvas.toDataURL("image/png");
          link.click();
          restore();
          if (btn) {
            btn.innerHTML = "✅ 완료!";
            setTimeout(function () { if (btn) btn.innerHTML = originalText; }, 2000);
          }
          if (typeof showToast === "function") showToast("📸 이미지로 저장되었습니다!");
        })
        .catch(function (err) {
          console.error("이미지 저장 오류:", err);
          restore();
          alert("이미지 저장 중 오류가 발생했습니다.");
        });
    }

    if (typeof html2canvas === "undefined") {
      var s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      s.onload = doCapture;
      s.onerror = function () { restore(); alert("라이브러리 로드 실패"); };
      document.head.appendChild(s);
    } else {
      doCapture();
    }
  }

  window.addSaveImageButton = addSaveImageButton;
  window.saveResultAsImage = saveResultAsImage;
})();
