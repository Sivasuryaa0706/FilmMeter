import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load custom .env file
const envPath = resolve(__dirname, ".env");
const env = dotenv.config({ path: envPath }).parsed;

// Convert environment variables to Vite's define format
const viteEnv = {};
for (const key in env) {
  viteEnv[`import.meta.env.${key}`] = JSON.stringify(env[key]);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
