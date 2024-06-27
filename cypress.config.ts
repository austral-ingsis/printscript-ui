import { defineConfig } from "cypress";
import dotenv from 'dotenv'
import {BACKEND_URL, FRONTEND_URL} from "./src/utils/constants";
dotenv.config()

export default defineConfig({
  e2e: {
    setupNodeEvents(_, config) {
      config.env = process.env
      return config
    },
    env: {
      FRONTEND_URL: process.env.VITE_REACT_APP_FRONTEND_URL,
      BACKEND_URL: process.env.VITE_REACT_APP_BACKEND_URL,
      AUTH0_USERNAME: process.env.VITE_REACT_APP_AUTH0_USERNAME,
      AUTH0_PASSWORD: process.env.VITE_REACT_APP_AUTH0_PASSWORD,
      auth0_domain: process.env.VITE_REACT_APP_AUTH0_DOMAIN,
      AUTH0_URL: process.env.VITE_REACT_APP_AUTH0_URL,
      client_secret: process.env.VITE_REACT_APP_CLIENT_SECRET,
      client_id: process.env.VITE_REACT_APP_AUTH0_CLIENT_ID,
      auth0_audience: process.env.VITE_REACT_APP_AUTH0_AUDIENCE
    },
    experimentalStudio: true,
    baseUrl: process.env.VITE_REACT_APP_FRONTEND_URL,
  },
});
