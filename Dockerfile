FROM node:alpine

WORKDIR /BACKEND_PUNTOVENTA

COPY .babelrc ./

COPY index.js ./

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]