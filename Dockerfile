
FROM node:20-alpine AS builder

RUN apk add --no-cache git

WORKDIR /app

RUN --mount=type=secret,id=my_secret \
    git clone https://github.com/DzikDzikowski/technologie-chmurowe-zad1.git .

FROM node:20-alpine

LABEL org.opencontainers.image.authors="Hubert"

ENV NODE_ENV=production PORT=8080
WORKDIR /app

COPY --from=builder /app/server.js .

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

USER node
EXPOSE 8080

CMD ["node", "server.js"]