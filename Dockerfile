FROM node:23-alpine

RUN apk --no-cache add curl=8.10.1-r0

WORKDIR /app

COPY ./build ./build

RUN npm install -g serve@14.2.3

USER node

CMD ["serve", "-s", "build"]

EXPOSE 3000

HEALTHCHECK \
  CMD curl -f http://localhost:3000 || exit 1