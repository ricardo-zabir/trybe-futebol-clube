FROM node:14-alpine

EXPOSE 3001

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm", "start" ]