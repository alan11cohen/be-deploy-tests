# Etapa 1: Build
FROM node:20 AS build

WORKDIR /app
COPY order-pay-backend/package*.json ./
RUN npm install
COPY order-pay-backend/ ./
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "dist/main"]
