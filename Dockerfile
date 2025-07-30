# Etapa 1: Build
FROM node:20 AS build

WORKDIR /app
COPY order-pay-backend/package.json ./
COPY order-pay-backend/package-lock.json ./
COPY order-pay-backend/pnpm-lock.yaml ./
RUN npm install
COPY order-pay-backend/ ./
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "dist/main"]
