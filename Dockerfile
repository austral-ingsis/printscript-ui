# image for building the project
FROM node:22-alpine as BUILD_IMAGE
# define the working directory
WORKDIR /app/printscript-ui
# copy the package.json file to the working directory
COPY package.json .
# install the dependencies
RUN npm install
# copy the source code to the working directory
COPY . .
# build the project
RUN npm run build

# generate the production image, which will be used to run the application. This is just a cleaning up of the build image for a lighter image
FROM node:22-alpine as PRODUCTION_IMAGE
# define the working directory
WORKDIR /app/printscript-ui

# copy the dist file (project builded) to the working directory
COPY --from=BUILD_IMAGE /app/printscript-ui/dist /app/printscript-ui/dist
# expose the port
EXPOSE 5173

# copy the package.json file to the working directory
COPY package.json .
# copy the vite config
COPY vite.config.ts .
# install tyoescript
RUN npm install typescript 
# run the application
CMD ["npm", "run", "preview"]