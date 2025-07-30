# Etapa 1: Build
FROM node:20 AS build

# Copy the entire backend directory
COPY order-pay-backend/ /app/

# Set working directory to the app
WORKDIR /app

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
