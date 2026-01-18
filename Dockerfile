# ----------------------
# 1단계: 빌드
# ----------------------
FROM node:20-alpine AS builder

WORKDIR /app

# npm 최신 버전 설치
RUN npm install -g npm@11.7.0

# npm 미러 설정 (속도/안정성)
RUN npm config set registry https://registry.npmmirror.com/

# package.json & package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (빌드 전용)
RUN npm ci --fetch-retries=5 --fetch-retry-factor=2 --fetch-retry-mintimeout=10000

# 소스 전체 복사
COPY . .

# Next.js 빌드
RUN npm run build

# ----------------------
# 2단계: 실행
# ----------------------
FROM node:20-alpine AS runner

WORKDIR /app

# 빌드된 파일 복사
COPY --from=builder /app ./

# 포트 설정
ENV PORT=3000

EXPOSE 3000

# 실행 명령어
CMD ["npm", "start"]
