FROM node:22-alpine as BUILD_IMAGE
WORKDIR /app/printscript-ui
COPY package.json .
RUN npm install
# copy the source code to the working directory
COPY . .
RUN npm run build
FROM node:22-alpine as PRODUCTION_IMAGE
WORKDIR /app/printscript-ui
COPY --from=BUILD_IMAGE /app/printscript-ui/dist /app/printscript-ui/dist
EXPOSE 5173
COPY package.json .
COPY vite.config.ts .
RUN npm install typescript
CMD ["npm", "run", "preview"]
