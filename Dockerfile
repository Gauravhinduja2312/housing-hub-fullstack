# --- Stage 1: The Builder ---
FROM node:18-alpine AS builder
WORKDIR /app

# MODIFIED: Copy package files from the backend sub-directory
COPY housing-hub-backend1/package*.json ./

RUN npm install

# MODIFIED: Copy the rest of the backend source code
COPY housing-hub-backend1/. .


# --- Stage 2: The Production Image ---
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .
EXPOSE 3001
CMD ["node", "server.js"]