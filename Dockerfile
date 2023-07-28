#BUILD APPLICATION STEP
FROM node:18-alpine as build

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm ci --verbose --no-optional

COPY . .

RUN npm run build

#SERVE APPLICATION IN PRODUCTION
FROM nginx:stable-alpine AS nginx

COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;" ]