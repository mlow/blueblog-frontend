FROM node:14-alpine as builder
WORKDIR /build
COPY *.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.19
COPY --from=builder /build/dist /usr/share/nginx/html
