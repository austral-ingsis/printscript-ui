FROM node:22-alpine as BUILD_IMAGE
WORKDIR /app/printscript-ui
COPY package.json .
RUN npm install
# copy the source code to the working directory
COPY . .
# Set environment variables
ARG VITE_FRONTEND_URL
ARG VITE_BACKEND_URL
ARG VITE_REACT_APP_AUTH0_DOMAIN
ARG VITE_REACT_APP_AUTH0_CLIENT_ID
ARG VITE_REACT_APP_AUTH0_AUDIENCE
ARG VITE_REACT_APP_AUTH0_CALLBACK_URL

ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_REACT_APP_AUTH0_DOMAIN=$VITE_REACT_APP_AUTH0_DOMAIN
ENV VITE_REACT_APP_AUTH0_CLIENT_ID=$VITE_REACT_APP_AUTH0_CLIENT_ID
ENV VITE_REACT_APP_AUTH0_AUDIENCE=$VITE_REACT_APP_AUTH0_AUDIENCE
ENV VITE_REACT_APP_AUTH0_CALLBACK_URL=$VITE_REACT_APP_AUTH0_CALLBACK_URL

RUN npm run build
FROM node:22-alpine as PRODUCTION_IMAGE
WORKDIR /app/printscript-ui
COPY --from=BUILD_IMAGE /app/printscript-ui/dist /app/printscript-ui/dist
EXPOSE 5173
COPY package.json .
COPY vite.config.ts .
RUN npm install typescript
CMD ["npm", "run", "preview"]
