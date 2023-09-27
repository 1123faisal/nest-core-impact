FROM node:18
WORKDIR /app
RUN npm i -g @angular/cli@14
COPY package.json .
RUN npm i
COPY . .
