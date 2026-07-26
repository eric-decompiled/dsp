import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: new URL('./index.html', import.meta.url).pathname,
        about: new URL('./about.html', import.meta.url).pathname,
      },
    },
  },
})
