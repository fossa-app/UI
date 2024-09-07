FROM node:22-alpine

WORKDIR /app

COPY ./build ./build

RUN npm install -g serve@14.2.3

USER node

CMD ["serve", "-s", "build"]

EXPOSE 3000

HEALTHCHECK \
  CMD curl -f http://localhost:3000 || exit 1