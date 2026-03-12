/**
 * 금융계산기.kr - Service Worker (sw.js)
 * PWA 지원을 위한 오프라인 캐싱 서비스 워커
 */

const CACHE_NAME = "richcalc-v1.0.0";

// 오프라인 상태에서도 동작할 핵심 파일 목록
const CORE_ASSETS = [
    "/",
    "/index.html",
    "/savings-calculator/index.html",
    "/loan-calculator/index.html",
    "/salary-calculator/index.html",
    "/savings-calculator/style.css",
    "/loan-calculator/style.css",
    "/darkmode.js",
    "/countup.js",
    "/toast.js",
    "/reset_form.js",
    "/currency_helper.js",
    "/export_image.js",
    "/seo_script.js",
    "/favicon.svg",
    "/manifest.json",
];

// ── Install: 핵심 파일 프리캐시 ──
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(CORE_ASSETS);
            })
            .then(function () {
                return self.skipWaiting();
            })
    );
});

// ── Activate: 구버전 캐시 삭제 ──
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches
            .keys()
            .then(function (cacheNames) {
                return Promise.all(
                    cacheNames
                        .filter(function (name) {
                            return name !== CACHE_NAME;
                        })
                        .map(function (name) {
                            return caches.delete(name);
                        })
                );
            })
            .then(function () {
                return self.clients.claim();
            })
    );
});

// ── Fetch: 네트워크 우선, 실패 시 캐시 폴백 ──
self.addEventListener("fetch", function (event) {
    // GET 요청만 처리
    if (event.request.method !== "GET") return;

    // 외부 CDN 요청은 캐시 사용 안 함
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(function (networkResponse) {
                // 성공한 네트워크 응답을 캐시에도 저장 (동적 업데이트)
                if (networkResponse && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(function () {
                // 네트워크 실패 시 캐시 폴백
                return caches.match(event.request).then(function (cachedResponse) {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // 캐시에도 없으면 홈으로 폴백
                    return caches.match("/index.html");
                });
            })
    );
});
