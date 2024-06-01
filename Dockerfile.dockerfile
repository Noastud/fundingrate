# Stage 1: Build the frontend
FROM node:14 AS frontend-builder

WORKDIR /app

COPY arbitrage-bot-ui/package*.json ./arbitrage-bot-ui/
RUN cd arbitrage-bot-ui && npm install

COPY arbitrage-bot-ui ./arbitrage-bot-ui
RUN cd arbitrage-bot-ui && npm run build

# Stage 2: Build the backend
FROM node:14 AS backend-builder

WORKDIR /app

COPY kraken-arbitrage-bot/package*.json ./kraken-arbitrage-bot/
RUN cd kraken-arbitrage-bot && npm install

COPY kraken-arbitrage-bot ./kraken-arbitrage-bot

# Stage 3: Final stage
FROM node:14

WORKDIR /usr/src/app

# Copy backend files
COPY --from=backend-builder /app/kraken-arbitrage-bot .

# Copy frontend build files to backend's public directory
COPY --from=frontend-builder /app/arbitrage-bot-ui/build ./public

# Install backend dependencies
RUN npm install

# Copy environment variables file
COPY .env .env

# Expose port
EXPOSE 3000

# Command to run the app
CMD [ "node", "backend/server.js" ]
