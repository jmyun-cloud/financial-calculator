/**
 * 금융계산기.kr - 결과 화면 이미지 저장 기능
 * html2canvas를 이용하여 결과 카드를 PNG 이미지로 다운로드합니다.
 */

(function () {
    /**
     * 기존 result-card에 "이미지로 저장" 버튼을 동적으로 추가하는 함수
     * 계산 결과 표시 이후 호출됩니다.
     */
    function addSaveImageButton(resultCardId) {
        const card = document.getElementById(resultCardId);
        if (!card) return;

        // 기존 버튼이 이미 있으면 중복 추가 방지
        if (card.querySelector(".save-image-btn")) return;

        const btn = document.createElement("button");
        btn.className = "save-image-btn";
        btn.type = "button";
        btn.innerHTML = "📸 이미지로 저장";
        btn.title = "계산 결과를 이미지로 저장합니다";

        btn.addEventListener("click", function () {
            saveResultAsImage(card);
        });

        // result-card 첫 번째 자식 (타이틀) 다음에 삽입하거나 카드 끝에 추가
        const title = card.querySelector(
            ".result-title, h2, h3, .result-card-title"
        );
        if (title && title.nextSibling) {
            // 타이틀 바로 다음에 버튼 삽입
            title.parentNode.insertBefore(btn, title.nextSibling);
        } else {
            card.appendChild(btn);
        }
    }

    /**
     * html2canvas로 카드를 캡처하고 PNG로 다운로드
     */
    function saveResultAsImage(cardElement) {
        const btn = cardElement.querySelector(".save-image-btn");

        // 버튼 숨기기 (캡처에서 제외)
        if (btn) btn.style.display = "none";

        const pageName =
            document.querySelector(".main-title, h1")?.textContent?.trim() ||
            "계산결과";
        const now = new Date();
        const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
        const fileName = `${pageName}_${dateStr}.png`;

        // 로딩 중 표시
        const originalHTML = btn ? btn.innerHTML : "";
        if (btn) btn.style.display = ""; // 잠시 다시 보여줘야 로딩 표시 가능하므로
        if (btn) {
            btn.innerHTML = "⏳ 저장 중...";
            btn.disabled = true;
            btn.style.display = "none"; // 다시 숨김
        }

        // html2canvas CDN 스크립트 로드 확인
        if (typeof html2canvas === "undefined") {
            loadHtml2Canvas(function () {
                captureAndDownload(cardElement, btn, originalHTML, fileName);
            });
        } else {
            captureAndDownload(cardElement, btn, originalHTML, fileName);
        }
    }

    /**
     * html2canvas CDN 동적 로드 (미리 로드되지 않은 경우 대비)
     */
    function loadHtml2Canvas(callback) {
        const script = document.createElement("script");
        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        script.onload = callback;
        script.onerror = function () {
            alert("이미지 저장 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인해주세요.");
        };
        document.head.appendChild(script);
    }

    /**
     * html2canvas로 캡처하고 PNG 다운로드
     */
    function captureAndDownload(cardElement, btn, originalHTML, fileName) {
        html2canvas(cardElement, {
            backgroundColor: "#ffffff",
            scale: 2, // 고화질 2x
            useCORS: true,
            logging: false,
            // 워터마크 여백 추가를 위한 패딩
            onclone: function (clonedDoc) {
                const clonedCard = clonedDoc.querySelector(".result-card");
                if (clonedCard) {
                    // 워터마크 삽입
                    const watermark = clonedDoc.createElement("div");
                    watermark.style.cssText =
                        "text-align:right; font-size:11px; color:#94a3b8; padding: 8px 16px 4px; font-family: sans-serif;";
                    watermark.textContent = "💰 richcalc.kr";
                    clonedCard.appendChild(watermark);
                }
            },
        })
            .then(function (canvas) {
                // 다운로드 링크 생성
                const link = document.createElement("a");
                link.download = fileName;
                link.href = canvas.toDataURL("image/png");
                link.click();

                // 버튼 복원
                if (btn) {
                    btn.innerHTML = "✅ 저장 완료!";
                    btn.disabled = false;
                    btn.style.display = "";
                    setTimeout(function () {
                        btn.innerHTML = originalHTML;
                    }, 2500);
                }

                // 토스트 알림
                if (typeof showToast === "function") {
                    showToast("📸 이미지로 저장되었습니다!");
                }
            })
            .catch(function (err) {
                console.error("이미지 저장 오류:", err);
                if (btn) {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                    btn.style.display = "";
                }
                alert("이미지 저장 중 오류가 발생했습니다.");
            });
    }

    // 전역에서 사용할 수 있도록 노출
    window.addSaveImageButton = addSaveImageButton;
    window.saveResultAsImage = saveResultAsImage;
})();
