FROM node:alpine

WORKDIR /BACKEND_PUNTOVENTA

COPY .babelrc ./


COPY package*.json ./

COPY . .

RUN npm install

RUN npm run build

CMD ["npm", "run", "dev"]