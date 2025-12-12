FROM --platform=$TARGETARCH node:25.2.1-alpine3.21

RUN apk --no-cache add curl=8.14.1-r2

WORKDIR /app

COPY ./build ./build

RUN npm install -g serve@14.2.3

USER node

CMD ["serve", "-s", "build"]

EXPOSE 3000

HEALTHCHECK \
  CMD curl -f http://localhost:3000 || exit 1