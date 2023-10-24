import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    outDir: '../API/wwwroot'
  },
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
});
