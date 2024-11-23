import { defineConfig } from "cypress";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  e2e: {
    setupNodeEvents(_, config) {
      config.env = process.env;
      return config;
    },
    experimentalStudio: true,
    baseUrl: process.env.FRONTEND_URL,
  },
});
