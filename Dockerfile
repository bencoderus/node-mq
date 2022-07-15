FROM node:16.13-alpine

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . ./