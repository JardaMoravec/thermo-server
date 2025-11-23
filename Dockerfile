FROM node:22-slim

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install -g npm@11.6.3
RUN npm install --only=production
