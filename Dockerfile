# First Stage: Build the Application
FROM node:22-alpine as BUILD_IMAGE
WORKDIR /app/printscript-ui

# Copy package.json and package-lock.json
COPY package.json .

# Install dependencies
RUN npm install

# Copy the source code to the working directory
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

# Run the build
RUN npm run build

# Second Stage: Production Image
FROM node:22-alpine as PRODUCTION_IMAGE
WORKDIR /app/printscript-ui

# Copy the build output from the build stage
COPY --from=BUILD_IMAGE /app/printscript-ui/dist /app/printscript-ui/dist

# Expose port 5173
EXPOSE 5173

COPY package.json .
COPY vite.config.ts .
RUN npm install typescript

# Start the application
CMD ["npm", "run", "preview"]
