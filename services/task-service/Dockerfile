FROM node:20-alpine AS build
WORKDIR /app

COPY tsconfig.json ./
COPY services/task-service/package*.json ./services/task-service/
WORKDIR /app/services/task-service
RUN npm install

COPY services/task-service/ ./
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app/services/task-service

COPY services/task-service/package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/services/task-service/dist ./dist
EXPOSE 3003
CMD ["node", "dist/index.js"]
