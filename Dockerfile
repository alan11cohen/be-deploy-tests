# Etapa 1: Build
FROM node:20 AS build

# Set working directory first
WORKDIR /app

# Copy the entire backend directory contents to current directory
COPY order-pay-backend/ ./

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "dist/main"]
