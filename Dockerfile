FROM node:22


WORKDIR /app

COPY app/package.json app/yarn.lock ./

RUN yarn install

COPY app/ .

EXPOSE 3000

CMD ["yarn", "start"]



