FROM node:18
WORKDIR /app
RUN npm i -g @angular/cli@14
COPY package.json .
RUN npm i
COPY . .
EXPOSE 4200
CMD ng s admin --host 0.0.0.0 --port 4200
