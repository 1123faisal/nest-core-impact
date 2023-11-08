FROM node:18
WORKDIR /app
RUN npm i -g @angular/cli@14
COPY package.json .
RUN npm i
COPY . .
EXPOSE 4201
CMD ng s coach --host 0.0.0.0 --port 4201
