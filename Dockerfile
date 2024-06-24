# First Stage: Build the Application
FROM node:lts-alpine3.14 as build

RUN mkdir /app

WORKDIR /app

COPY package.json .

RUN npm install

# Copy the source code to the working directory
COPY . .

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

# ---------------

# Second Stage: Production Image
FROM node:lts-alpine3.14 as production
WORKDIR /app

# Copy the build output from the build stage
COPY --from=build /app/dist /app/dist
COPY package.json .
COPY vite.config.ts .

RUN npm install --production
RUN npm install vite

# Expose port 5173
EXPOSE 5173

# Use 'npm run preview' to serve the built app
CMD ["npm", "run", "preview"]
