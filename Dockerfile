FROM node:14-alpine as dev
WORKDIR /app
COPY *.json *.js ./
RUN npm ci
COPY src ./src
COPY public ./public

FROM dev as build
RUN npm run build

FROM nginx:1.19-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
