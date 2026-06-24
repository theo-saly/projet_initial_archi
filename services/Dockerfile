FROM node:20-alpine AS build
ARG SERVICE
WORKDIR /app

COPY tsconfig.json ./
COPY services/${SERVICE}/package*.json ./services/${SERVICE}/
WORKDIR /app/services/${SERVICE}
RUN npm install

COPY services/${SERVICE}/ ./
RUN npm run build

FROM node:20-alpine AS production
ARG SERVICE
ARG PORT
WORKDIR /app/services/${SERVICE}

COPY services/${SERVICE}/package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/services/${SERVICE}/dist ./dist
EXPOSE ${PORT}
CMD ["node", "dist/index.js"]
