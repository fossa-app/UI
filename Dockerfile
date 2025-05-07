FROM node:24-alpine

RUN apk --no-cache add curl=8.12.1-r1

WORKDIR /app

COPY ./build ./build

RUN npm install -g serve@14.2.3

USER node

CMD ["serve", "-s", "build"]

EXPOSE 3000

HEALTHCHECK \
  CMD curl -f http://localhost:3000 || exit 1