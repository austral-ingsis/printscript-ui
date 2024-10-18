# Stage 1: Build the project
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the built files
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 4173
RUN npm install -g vite
CMD ["npx", "vite", "preview", "--host", "0.0.0.0"]

# npx vite preview -> Vite creates a server to serve the dist directory.
# --host 0.0.0.0 -> Ensures that the server is accessible on all network interfaces.