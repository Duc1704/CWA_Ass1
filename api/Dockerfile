# syntax=docker/dockerfile:1

# --- Base dependencies layer ---
FROM node:20 AS base
WORKDIR /app

# Install only npm dependencies without running lifecycle scripts yet
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy Prisma schema early and generate client
COPY prisma ./prisma
RUN npm run prisma:generate

# Copy the rest of the source
COPY . .

# --- Development target ---
FROM base AS development
ENV NODE_ENV=development
ENV PORT=4002
EXPOSE 4002
CMD ["npm", "run", "dev"]

# --- Production build ---
FROM base AS build
ENV NODE_ENV=production
RUN npm run build

# --- Production runtime ---
FROM node:20-slim AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4002

# Copy node modules (installed in base) and built artifacts
COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY package*.json ./

EXPOSE 4002
CMD ["node", "dist/server.js"]


