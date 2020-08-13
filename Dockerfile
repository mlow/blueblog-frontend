FROM node:14-alpine as dev
WORKDIR /app
COPY *.json ./
RUN npm ci
COPY . .

FROM dev as build
RUN npm run build

FROM nginx:1.19-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
