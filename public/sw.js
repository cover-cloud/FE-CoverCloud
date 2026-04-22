const CACHE_NAME = "my-app-v1";

// 앱 셸에 필요한 핵심 파일들을 캐시합니다
const PRECACHE_URLS = ["/"];

// 설치 시 핵심 파일 캐시
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

// 이전 캐시 정리
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

// 네트워크 우선, 실패 시 캐시 사용
self.addEventListener("fetch", (event) => {
  // http/https 요청만 캐시 (chrome-extension 등 제외)
  if (!event.request.url.startsWith("http")) return;
  // API 요청은 캐시하지 않음
  if (event.request.url.includes("/api/")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 성공한 응답을 캐시에 저장
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 오프라인일 때 캐시에서 반환
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match("/offline");
        });
      }),
  );
});
