# ---------- build stage ----------
FROM node:20-bullseye-slim AS builder
WORKDIR /app

# Стабильнее сеть на некоторых хостингах: зеркала npm/GH
RUN npm config set registry "https://registry.npmjs.org/" \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retries 5 \
 && npm config set strict-ssl true \
 && npm config set @github:registry "https://npm.pkg.github.com"

# 1) Только манифесты — для кеша
COPY package*.json ./

# 2) Установка зависимостей (dev тоже нужны для билда)
#    --legacy-peer-deps уменьшает конфликтность
RUN npm install --no-audit --no-fund --legacy-peer-deps

# 3) Код
COPY . .

# 4) Предзагружаем SWC под архитектуру хоста
ARG NEXT_VERSION=15.4.6
RUN arch=$(uname -m) && \
    if [ "$arch" = "aarch64" ] || [ "$arch" = "arm64" ]; then \
      npm install -D @next/swc-linux-arm64-gnu@${NEXT_VERSION} || true; \
    else \
      npm install -D @next/swc-linux-x64-gnu@${NEXT_VERSION} || true; \
    fi

# 5) Анти-скачивание шрифтов + без телеметрии
ENV NEXT_FONT_GOOGLE_STRATEGY=none
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_WORKERS=1
ENV NODE_OPTIONS="--max-old-space-size=1400"

# 5.5) Prisma client
RUN npx prisma generate

# 6) Билдим
RUN npm run build

# ---------- runtime stage ----------
FROM node:20-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Migrate DB on startup — copy full prisma CLI package
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

EXPOSE 3000
ENV HOSTNAME=0.0.0.0
CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && node server.js"]
