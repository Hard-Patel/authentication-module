# 1) Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# 2) Runtime stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# ✅ Copy build output
COPY --from=builder /app/dist ./dist

# ✅ Copy entrypoint correctly
COPY entrypoint.sh ./entrypoint.sh

ENV NODE_ENV=production
ENV PORT=3000

# ✅ Now chmod will work
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

CMD ["./entrypoint.sh"]
