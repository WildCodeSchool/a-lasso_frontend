FROM node:20-slim
WORKDIR /app
COPY package*.json angular.json tsconfig*.json ./
RUN npm install && npm install -g @angular/cli
EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]


# https://docs.docker.com/guides/angular/develop/#step-5-test-compose-watch-with-angular 
# FROM node:22.14.0-alpine AS dev
# ENV NODE_ENV=development
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN --mount=type=cache,target=/root/.npm npm ci
# EXPOSE 4200
# CMD ["npm", "start", "--", "--host=0.0.0.0"]