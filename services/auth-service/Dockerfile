FROM node:20-alpine AS build
WORKDIR /app

COPY tsconfig.json ./
COPY services/auth-service/package*.json ./services/auth-service/
WORKDIR /app/services/auth-service
RUN npm install

COPY services/auth-service/ ./
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app/services/auth-service

COPY services/auth-service/package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/services/auth-service/dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
