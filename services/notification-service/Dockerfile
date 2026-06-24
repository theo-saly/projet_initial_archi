FROM node:20-alpine AS build
WORKDIR /app

COPY tsconfig.json ./
COPY services/notification-service/package*.json ./services/notification-service/
WORKDIR /app/services/notification-service
RUN npm install

COPY services/notification-service/ ./
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app/services/notification-service

COPY services/notification-service/package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/services/notification-service/dist ./dist
EXPOSE 3004
CMD ["node", "dist/index.js"]
