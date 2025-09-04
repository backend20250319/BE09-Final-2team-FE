# 1단계: 빌드
FROM node:20-alpine AS builder
WORKDIR /app

# 패키지 설치 (devDependencies 포함, 빌드용)
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2단계: 런타임
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# prod dependencies만 설치
COPY package*.json ./
RUN npm ci --omit=dev

# 빌드 산출물만 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
