# FROM node:alpine
# FROM node:lts-alpine
# FROM node:16
FROM --platform=linux/amd64 node:16-alpine
# RUN apk add g++ make python

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
# RUN npm run build

# Bundle app source
COPY dist/apps/linter-server /usr/src/app

EXPOSE 3000
CMD [ "node", "main.js" ]
