import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from 'path'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    https: true
  },
  build: {
    outDir: '../API/wwwroot'
  },
  plugins: [react(), mkcert()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
});
