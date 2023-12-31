# BUILD APPLICATION STEP
FROM node:18-alpine as build

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Because at vite.config.ts we use "git rev-parse --short HEAD"
RUN apk add git

COPY package.json .
COPY package-lock.json .

RUN npm ci --verbose

COPY . .

RUN npm run build

# SERVE APPLICATION IN PRODUCTION
FROM nginx:stable-alpine AS nginx

COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;" ]