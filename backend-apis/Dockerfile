FROM node:16
WORKDIR /app
COPY package.json .
RUN npm i
COPY . .
EXPOSE 7001
CMD ["npm", "run","start:dev"]
