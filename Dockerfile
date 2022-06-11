FROM node:16.13-alpine

WORKDIR /app

COPY . .
COPY package*.json ./

RUN yarn

EXPOSE 3000