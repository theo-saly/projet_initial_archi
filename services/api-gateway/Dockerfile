FROM node:20-alpine AS build
WORKDIR /app

COPY tsconfig.json ./
COPY services/api-gateway/package*.json ./services/api-gateway/
WORKDIR /app/services/api-gateway
RUN npm install

COPY services/api-gateway/ ./
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app/services/api-gateway

COPY services/api-gateway/package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/services/api-gateway/dist ./dist
EXPOSE 3005
CMD ["node", "dist/index.js"]
