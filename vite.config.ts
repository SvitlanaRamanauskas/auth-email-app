import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   port: 3000,
  //   proxy: {
  //     '/api': {
  //       target: 'http://68.183.74.14:4005',
  //       changeOrigin: true,
  //       secure: false,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
  plugins: [
    react(),
    tailwindcss()
  ],
  base: "/auth-email-app/",
})
