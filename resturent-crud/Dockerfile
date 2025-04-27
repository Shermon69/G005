FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8081

ENV PORT=8081

CMD ["node", "dist/app.js"]