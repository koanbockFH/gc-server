FROM node:13-slim AS builder

WORKDIR /app

COPY . .

RUN npm install && \
    npm run build

FROM alpine:latest

ENV NODE_ENV=production 

WORKDIR /app

# Update & install required packages
RUN apk add --update nodejs bash

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD ["node", "-r", "./dist/main.js"]
