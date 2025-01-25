// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  runtimeConfig: {
    // Private environment variables (accessible only on the server side)
    apiBaseUrl: process.env.API_BASE_URL,
    
    // Public environment variables (accessible on both client and server)
    public: {
      apiBaseUrl: process.env.API_BASE_URL,
    },
  },
  compatibilityDate: '2024-11-01',
  css: [
    '@/assets/css/tailwind.css',
    'toastify-js/src/toastify.css', // Add Toastify CSS here
  ],
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});

