import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    federation({
      name: 'cart',
      filename: 'remoteEntry.js',
      exposes: {
        './Cart': './src/Cart.svelte',
      },
      shared: ['svelte']
    })
  ],
  build: {
    target: 'esnext'
  },
  server: {
    port: 4003
  },
  preview: {
    port: 4003
  }
})
