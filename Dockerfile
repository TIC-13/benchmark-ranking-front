FROM node:24 

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install 

COPY . .

RUN yarn next build

CMD yarn next start


