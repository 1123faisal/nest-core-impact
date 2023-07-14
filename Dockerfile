FROM node:alpine
WORKDIR /app
RUN npm i -g pnpm
COPY package.json .
RUN pnpm i
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
