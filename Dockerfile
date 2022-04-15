FROM ubuntu

FROM node:16.14.0

RUN apt-get update

RUN export DEBIAN_FRONTEND=noninteractive

RUN apt-get install -y tzdata

RUN ln -fs /usr/share/zoneinfo/America/Guayaquil /etc/localtime 

RUN dpkg-reconfigure -f noninteractive tzdata

WORKDIR /crontime

COPY .babelrc ./

COPY index.js ./

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]