FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN CYPRESS_INSTALL_BINARY=0 npm ci
COPY . .
# Vite inlines VITE_* at build time, so they are build args, not runtime env
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE
ARG VITE_BACKEND_URL
RUN npm run build

FROM node:20-alpine
RUN npm install -g serve@14.2.4
WORKDIR /app
COPY --from=build /app/dist ./dist
EXPOSE 3000
# -s: unknown paths (client-side routes like /rules) fall back to index.html
CMD ["serve", "-s", "dist", "-l", "3000"]
