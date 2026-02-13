// src/app/post/[id]/view/loading.tsx
export default function Loading() {
  return (
    <div className="flex flex-col md:flex-row gap-[52px] p-4 max-w-[1200px] mx-auto">
      {/* 왼쪽: 메인 콘텐츠 영역 스켈레톤 */}
      <div className="w-full md:w-[66%]">
        {/* 비디오 영역 (16:9 비율 유지) */}
        <div className="w-full aspect-video bg-gray-200 animate-pulse rounded-xl mb-6" />

        {/* 제목 영역 */}
        <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4 mb-4" />

        {/* 상세 정보 영역 */}
        <div className="h-20 bg-gray-200 animate-pulse rounded w-full" />
      </div>

      {/* 오른쪽: 사이드바 영역 스켈레톤 (PC에서만 보임) */}
      <div className="hidden md:block md:w-[33%]">
        <div className="h-5 bg-gray-200 animate-pulse rounded w-1/2 mb-6" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 mb-4">
            <div className="w-32 h-20 bg-gray-200 animate-pulse rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
