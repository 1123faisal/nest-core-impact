FROM node:18
WORKDIR /app
RUN npm i -g @angular/cli@14
COPY package.json .
RUN npm i
COPY . .
EXPOSE 4202
CMD ng s org --host 0.0.0.0 --port 4202
