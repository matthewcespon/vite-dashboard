import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // LOCAL DEV - PROXY
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "https://express-backend-beryl.vercel.app",
  //       changeOrigin: true,
  //       secure: false,
  //       ws: true,
  //     },
  //   },
  // },
});
