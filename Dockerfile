FROM --platform=linux/amd64 node:18-alpine

# Crea el directorio de trabajo
WORKDIR /app

# Copia solo los archivos necesarios para instalar las dependencias
COPY package*.json ./

ARG FRONTEND_URL
ARG VITE_BACKEND_URL
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_PASSWORD
ARG VITE_AUTH0_USERNAME

ENV FRONTEND_URL=${FRONTEND_URL}
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_AUTH0_DOMAIN=${VITE_AUTH0_DOMAIN}
ENV VITE_AUTH0_CLIENT_ID=${VITE_AUTH0_CLIENT_ID}
ENV VITE_AUTH0_PASSWORD=${VITE_AUTH0_PASSWORD}
ENV VITE_AUTH0_USERNAME=${VITE_AUTH0_USERNAME}

RUN npm install

COPY . .

# Expone el puerto que tu aplicación utiliza en modo dev
EXPOSE 5173

# Comando para correr en modo desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
