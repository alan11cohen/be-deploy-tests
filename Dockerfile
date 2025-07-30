FROM node:20-alpine

WORKDIR /app

# Copy everything
COPY . .

# Go to the backend directory and build
WORKDIR /app/order-pay-backend
RUN npm install
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:prod"]
