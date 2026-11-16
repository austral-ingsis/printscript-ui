# Buildea la vite application con la version de Node que pide el package.json
FROM node:20-alpine AS build

WORKDIR /app

# Vite reemplaza estas variables públicas en el bundle durante `npm run build`
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE

ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN \
    VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID \
    VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE

# Instala dependencias
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Solo para el build de produccion
FROM nginx:1.27-alpine AS runtime

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1/health || exit 1
