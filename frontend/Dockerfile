# syntax=docker/dockerfile:1

# --- Base dependencies layer ---
FROM node:20 AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy app source
COPY . .

# --- Development target ---
FROM base AS development
ENV NODE_ENV=development
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- Production build ---
FROM base AS build
ENV NODE_ENV=production
RUN npm run build

# --- Production runtime ---
FROM node:20-slim AS production
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.ts ./next.config.ts
COPY package*.json ./

EXPOSE 3000
CMD ["npm", "run", "start"]