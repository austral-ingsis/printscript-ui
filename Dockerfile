FROM oven/bun:alpine AS build
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_API_URL
WORKDIR /app
COPY bun.lockb .
COPY package.json .
RUN apk update
RUN apk add unzip gzip
RUN bun install
COPY . .
RUN VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN \
    VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID \
    VITE_API_URL=$VITE_API_URL \
    bun run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80