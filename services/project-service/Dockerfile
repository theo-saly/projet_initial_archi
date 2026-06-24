FROM node:20-alpine AS build
WORKDIR /app

COPY tsconfig.json ./
COPY services/project-service/package*.json ./services/project-service/
WORKDIR /app/services/project-service
RUN npm install

COPY services/project-service/ ./
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app/services/project-service

COPY services/project-service/package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/services/project-service/dist ./dist
EXPOSE 3002
CMD ["node", "dist/index.js"]
