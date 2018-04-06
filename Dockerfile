FROM node as node
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY ./ /app/
ARG env=prod
RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx

FROM nginx:alpine
COPY --from=node /app/build /usr/share/nginx/html
COPY server.conf /etc/nginx/conf.d/default.conf
