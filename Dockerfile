# Stage 1: Build client
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build server
FROM node:20-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npx prisma generate

# Stage 3: Production con OpenSSL para Prisma
FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=server-build /app/server ./server
COPY --from=client-build /app/client/dist ./client/dist
COPY package.json ./

WORKDIR /app/server

# Re-generate Prisma for debian-openssl-3.0.x
RUN npx prisma generate

EXPOSE 4000

CMD ["sh", "-c", "npx prisma db push --skip-generate && npx prisma db seed && node index.js"]
