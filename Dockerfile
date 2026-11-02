# Etapa 1: construye la UI. Node solo hace falta para esto.
FROM node:22-alpine@sha256:fe4f6d74e20370acb04ad889077d14d0f64a9c8ea6a42bc60cddf1e844699914 AS build

WORKDIR /app

# Cypress está en dependencies pero la imagen no lo usa: sin esto baja su binario.
ENV CYPRESS_INSTALL_BINARY=0

# Primero solo lo que define las dependencias, para que Docker reuse esta capa
# mientras no cambien.
COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

# Relativa: la misma imagen sirve en dev y en prod, bajo el mismo dominio que la API.
ARG BACKEND_URL=/api
RUN npm run build

# Etapa 2: solo los archivos estáticos, servidos por nginx.
FROM nginx:1.30-alpine@sha256:47928bf67eb62a1863cb08d9ecb52d3e704304ba614eaee17884204677702951

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
