/**
 * 금융계산기.kr - 결과 화면 이미지 저장 기능
 * html2canvas를 이용하여 결과 카드를 PNG 이미지로 다운로드합니다.
 */

(function () {
  /**
   * result-card 우상단에 "📸 저장" 버튼을 absolute 위치로 추가.
   * DOM 구조를 변경하지 않아 레이아웃에 영향을 주지 않습니다.
   */
  function addSaveImageButton(resultCardId) {
    var card = document.getElementById(resultCardId);
    if (!card) return;
    if (card.querySelector(".save-image-btn")) return;

    var btn = document.createElement("button");
    btn.className = "save-image-btn";
    btn.type = "button";
    btn.innerHTML = "📸 저장";
    btn.title = "계산 결과를 이미지로 저장합니다";

    btn.addEventListener("click", function () {
      saveResultAsImage(card);
    });

    // absolute 배치를 위해 카드에 position:relative 보장
    var pos = window.getComputedStyle(card).position;
    if (pos === "static") {
      card.style.position = "relative";
    }

    // 카드의 마지막 자식으로 추가 (CSS로 absolute 우상단 배치)
    card.appendChild(btn);
  }

  /**
   * html2canvas로 카드를 캡처하고 PNG로 다운로드
   */
  function saveResultAsImage(cardElement) {
    var btn = cardElement.querySelector(".save-image-btn");
    var originalText = btn ? btn.innerHTML : "";

    if (btn) {
      btn.style.opacity = "0"; // 캡처에서 숨김
      btn.disabled = true;
    }

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
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        logging: false,
        ignoreElements: function (el) {
          return el.classList && el.classList.contains("save-image-btn");
        },
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

          if (btn) {
            btn.innerHTML = "✅ 완료!";
            btn.style.opacity = "1";
            btn.disabled = false;
            setTimeout(function () {
              btn.innerHTML = originalText;
            }, 2000);
          }

          if (typeof showToast === "function") {
            showToast("📸 이미지로 저장되었습니다!");
          }
        })
        .catch(function (err) {
          console.error("이미지 저장 오류:", err);
          if (btn) {
            btn.innerHTML = originalText;
            btn.style.opacity = "1";
            btn.disabled = false;
          }
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
        if (btn) {
          btn.style.opacity = "1";
          btn.disabled = false;
        }
      };
      document.head.appendChild(s);
    } else {
      doCapture();
    }
  }

  window.addSaveImageButton = addSaveImageButton;
  window.saveResultAsImage = saveResultAsImage;
})();
