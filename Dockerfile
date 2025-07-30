# Build stage
FROM node:20-alpine AS builder

WORKDIR /build
COPY . .
RUN cd order-pay-backend && npm install && npm run build

# Production stage  
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /build/order-pay-backend/dist ./dist
COPY --from=builder /build/order-pay-backend/package*.json ./
RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "dist/main"]
