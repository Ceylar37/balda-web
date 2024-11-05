FROM node:20.11.0-alpine AS build

WORKDIR /app

COPY yarn.lock package.json ./

RUN yarn

COPY . .

RUN yarn build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html


ENV API_URL=http://localhost:8081

COPY nginx.conf.template /nginx.conf.template
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]