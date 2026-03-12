/**
 * 금융계산기.kr - 결과 화면 이미지 저장 기능
 * html2canvas를 이용하여 결과 카드를 PNG 이미지로 다운로드합니다.
 *
 * [포지셔닝 전략]
 * toast.js 의 injectCopyButtons() 가 .result-title 을 display:flex 로 만들고
 * 그 안에 .copy-result-btn 을 appendChild 합니다.
 * 저장 버튼도 같은 flex 행(.result-title) 안에 삽입하여 복사하기 버튼 바로 옆에 배치합니다.
 */
(function () {
  /**
   * 저장 버튼을 .result-title 의 flex 행, 복사하기 버튼 옆에 삽입.
   */
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

    // toast.js 가 이미 실행된 후라면 .result-title 이 flex 가 되어 있고
    // .copy-result-btn 이 그 안에 있습니다 → 바로 그 옆에 삽입
    var titleEl = card.querySelector(".result-title");
    if (titleEl) {
      // flex 행이 안 되어 있으면(toast.js 보다 먼저 실행된 경우) 임시 적용
      if (getComputedStyle(titleEl).display !== "flex") {
        titleEl.style.display = "flex";
        titleEl.style.justifyContent = "space-between";
        titleEl.style.alignItems = "center";
      }
      titleEl.appendChild(btn);
    } else {
      // 타이틀이 없으면 카드 첫 줄에 삽입
      card.insertBefore(btn, card.firstChild);
    }
  }

  /**
   * html2canvas 로 카드 캡처 → PNG 다운로드
   */
  function saveResultAsImage(cardElement) {
    var btn = cardElement.querySelector(".save-image-btn");
    var titleEl = cardElement.querySelector(".result-title");
    var originalText = btn ? btn.innerHTML : "";

    // 캡처 전 result-title flex 항목 일시 숨김 (버튼들)
    if (titleEl) titleEl.style.justifyContent = "flex-start";
    if (btn) btn.style.display = "none";
    var copyBtn = cardElement.querySelector(".copy-result-btn");
    if (copyBtn) copyBtn.style.display = "none";

    var pageName =
      (document.querySelector(".main-title, h1") || {}).textContent || "계산결과";
    pageName = pageName.trim();
    var now = new Date();
    var dateStr =
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");
    var fileName = pageName + "_" + dateStr + ".png";

    function doCapture() {
      html2canvas(cardElement, {
        backgroundColor:
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "#1a2435"
            : "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        onclone: function (clonedDoc) {
          var cloned = clonedDoc.querySelector(".result-card");
          if (cloned) {
            var wm = clonedDoc.createElement("div");
            wm.style.cssText =
              "text-align:right;font-size:11px;color:#94a3b8;padding:6px 16px 2px;font-family:sans-serif;";
            wm.textContent = "💰 richcalc.kr";
            cloned.appendChild(wm);
          }
        },
      })
        .then(function (canvas) {
          var link = document.createElement("a");
          link.download = fileName;
          link.href = canvas.toDataURL("image/png");
          link.click();

          // 버튼 복원
          if (titleEl) titleEl.style.justifyContent = "space-between";
          if (btn) { btn.style.display = ""; btn.innerHTML = "✅ 완료!"; }
          if (copyBtn) copyBtn.style.display = "";
          setTimeout(function () {
            if (btn) btn.innerHTML = originalText;
          }, 2000);

          if (typeof showToast === "function") {
            showToast("📸 이미지로 저장되었습니다!");
          }
        })
        .catch(function (err) {
          console.error("이미지 저장 오류:", err);
          if (titleEl) titleEl.style.justifyContent = "space-between";
          if (btn) { btn.style.display = ""; btn.innerHTML = originalText; }
          if (copyBtn) copyBtn.style.display = "";
          alert("이미지 저장 중 오류가 발생했습니다.");
        });
    }

    if (typeof html2canvas === "undefined") {
      var s = document.createElement("script");
      s.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      s.onload = doCapture;
      s.onerror = function () {
        alert("라이브러리 로드에 실패했습니다. 인터넷 연결을 확인하세요.");
        if (titleEl) titleEl.style.justifyContent = "space-between";
        if (btn) { btn.style.display = ""; }
        if (copyBtn) copyBtn.style.display = "";
      };
      document.head.appendChild(s);
    } else {
      doCapture();
    }
  }

  window.addSaveImageButton = addSaveImageButton;
  window.saveResultAsImage = saveResultAsImage;
})();
