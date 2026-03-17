# CoverCloud 🎵

> 음악 커버를 공유하고 발견하는 커뮤니티 플랫폼

**배포 주소** : [https://covercloud.kr](https://covercloud.kr)

---

## 프로젝트 소개

CoverCloud는 뮤지션들이 자신의 커버곡을 공유하고, 다른 아티스트의 커버를 발견할 수 있는 음악 커뮤니티 플랫폼입니다.  
프론트엔드 1인 개발로 기획부터 배포까지 전 과정을 담당했습니다.

| 구분      | 내용                                                    |
| --------- | ------------------------------------------------------- |
| 개발 기간 | 2025.11 ~ 진행 중                                       |
| 팀 구성   | 프론트엔드 1명 (본인), 백엔드 1명, 기획 1명, 디자인 1명 |
| 배포      | Netlify + 가비아 커스텀 도메인                          |

---

## 기술 스택

| 분류      | 기술                         |
| --------- | ---------------------------- |
| Framework | Next.js 15 (App Router)      |
| Language  | TypeScript                   |
| 상태 관리 | Zustand                      |
| 서버 상태 | React Query (TanStack Query) |
| 스타일    | Tailwind CSS, MUI            |
| 폼 유효성 | React Hook Form + Zod        |
| 기타      | Axios, Day.js, clsx          |

---

## 주요 기능

### 🔐 인증 구조

- 소셜 로그인 (카카오, 네이버)
- Refresh Token은 HttpOnly 쿠키, Access Token은 Zustand 메모리에서만 관리 (XSS 방어)
- Axios 인터셉터에서 401 감지 시 자동 토큰 갱신
- `isRefreshing` 플래그 + `failedQueue` 로 동시 다중 요청 시 refresh 중복 호출 방지

### 🎵 커버곡 등록

- iTunes API로 원곡 정보 검색 및 자동 입력
- 검색 결과에 없을 경우 직접 입력 폴백 UI 제공
- YouTube, TikTok, SoundCloud URL 파싱 및 임베드 (허용되지 않은 URL 차단)
- 태그, 장르, 커버 아티스트 정보 등록

### 🔍 검색 및 필터

- 제목 / 태그 탭 검색
- 태그 클릭 시 해당 태그 검색 페이지로 이동
- 검색 결과 최신순 / 인기순 정렬
- 장르별 (K-POP, J-POP, POP 등) + 기간별 (전체 / 월간 / 주간 / 일간) 필터
- **필터 및 페이지 상태를 URL 쿼리 파라미터로 관리** → 새로고침, 뒤로가기, 링크 공유 시 상태 유지

### 💬 커뮤니티

- 게시글 CRUD
- 좋아요 / 댓글 / 대댓글 (React Query `useMutation` + `invalidateQueries` 로 실시간 반영)
- 페이지네이션

### 👤 마이페이지

- 내가 쓴 글 / 좋아요한 글 / 댓글 단 글 탭으로 조회
- 프로필 이미지 변경 (URL 변환 방식), 닉네임 변경
- 로그아웃 / 계정 삭제

### 🔎 SEO

- 게시글 페이지에 `generateMetadata`로 동적 SEO 적용
- 커버 제목, 아티스트, 태그를 메타데이터로 구성
- `revalidate: 120` ISR로 성능 최적화

---

## 트러블슈팅

### 1. Safari 로그인 불가 문제

**문제** : Safari에서 소셜 로그인 후 인증이 되지 않는 현상 발생  
**원인** : 프론트(Netlify)와 백엔드 도메인 불일치로 HttpOnly 쿠키가 차단됨  
**해결** : 가비아에서 커스텀 도메인을 구매해 Netlify에 연결, 동일 도메인 환경 구성

### 2. Docker 배포 실패 → Netlify 전환

**문제** : Docker로 프론트 빌드 시 용량 초과로 배포 불가  
**해결** : Netlify로 배포 방식 전환, 빌드 최적화 후 정상 배포

### 3. Spotify API → iTunes API 교체

**문제** : Spotify API 정책 변경으로 원곡 검색 기능 사용 불가  
**해결** : iTunes Search API로 교체하여 서비스 중단 없이 기능 유지

---

## 프로젝트 구조

```
src/
├── app/
│   ├── api/          # API 호출 함수 (도메인별 분리)
│   │   ├── auth/     # 인증 관련 (refresh, logout 등)
│   │   ├── cover/    # 게시글 관련
│   │   ├── spotify/  # 원곡 검색
│   │   └── mypage/   # 마이페이지
│   ├── lib/
│   │   └── api.ts    # Axios 인스턴스 + 인터셉터
│   └── store/
│       └── useAuthStore.ts  # 인증 상태 관리
└── components/       # 공통 컴포넌트
```
