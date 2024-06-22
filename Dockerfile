# First Stage: Build the Application
FROM node:22-alpine as BUILD_IMAGE
WORKDIR /app/printscript-ui

# Copy package.json and package-lock.json
COPY package.json .

# Install dependencies
RUN npm install

# Copy the source code to the working directory
COPY . .

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
