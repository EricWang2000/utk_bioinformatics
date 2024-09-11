FROM node:20.16.0-alpine AS builder
WORKDIR /app
COPY . . 
RUN npm install
RUN npm run build

FROM httpd:alpine3.15
WORKDIR /usr/local/apache2/htdocs/
RUN rm -rf /usr/local/apache2/htdocs/*
COPY --from=builder /app/dist/out/browser/ .