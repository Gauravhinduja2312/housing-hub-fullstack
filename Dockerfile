# --- Stage 1: The Builder ---
FROM node:18-alpine AS builder
WORKDIR /app

# --- DEBUGGING STEP ---
# List the contents of the repository root to see what Docker sees
RUN ls -la

# Copy package files
COPY housing-hub-backend1/package.json ./
COPY housing-hub-backend1/package-lock.json ./

RUN npm install

# Copy the rest of the backend source code
COPY housing-hub-backend1/. .


# --- Stage 2: The Production Image ---
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .
EXPOSE 3001
CMD ["node", "server.js"]