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

# Stage 3: Production
FROM node:20-alpine
WORKDIR /app

# Copy server
COPY --from=server-build /app/server ./server

# Copy client build
COPY --from=client-build /app/client/dist ./client/dist

# Copy root package.json
COPY package.json ./

# Set working directory to server
WORKDIR /app/server

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:4000/api/health || exit 1

# Start
CMD ["npm", "start"]
