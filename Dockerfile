# 1) Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm i

# Copy source
COPY . .

# Build NestJS
RUN npm run build

# 2) Runtime stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm i --omit=dev

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main.js"]
