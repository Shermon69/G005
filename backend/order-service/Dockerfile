FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=8082
ENV MONGODB_URI=mongodb+srv://vihanga:731ViiWA@vihaaitp.zd6bn.mongodb.net/order-service?retryWrites=true&w=majority
ENV RESTAURANT_SERVICE_URL=http://restaurant-service:8081

EXPOSE 8082

CMD ["node", "src/app.js"]