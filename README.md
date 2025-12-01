mui, tailwindcss, react-query, zustand, react-hook-form, dayjs, clsx, zod 인스톨 적용

mui 적용  
MuiProvider.jsx 파일 생성  
theme/index.ts 파일에 기본스타일 적용  
createEmotionCache.ts 파일 생성  
registry.tsx 캐시를 저장하고 비우는 역할

Tailwindcss 적용  
globals.css 파일 생성

react-query 적용  
QueryProvider.jsx 파일 생성

zustand 적용  
useAuthStore.jsx 파일 생성

# FE-CoverCloud

# 2025.11.21

- basic 메인페이지
- basic 모달
- basic 페이지네이션
- basic 포스트카드
- basic 로그인
- basic 헤더

스포티파이 연동

- Spotify 검색 API 연동

# 2025.11.24

- 스포티파이 검색제한 곡명, 아티스트(제한 5개)
- 태그 및 태그 유효성검사
- 동영상 추가 및 유효성검사(유튜브 url은 리스트검사시 제한이있는듯?)

# 2025.12.01

- 스포티파이 아티스트검색 기능 구현 한글로 아티스트 정보 받아오기
- 아티스트정보 컴포넌트 생성
- 무한스크롤 구현 (reactQuery의 infiniteQuery 사용) - 클릭시 정보 저장
- edit, create, view 페이지 구분
