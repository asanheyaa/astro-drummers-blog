// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config

export default defineConfig({
   site: 'https://asanheyaa.github.io',
  base: '/astro-drummers-blog',
  image: {
  remotePatterns: [
     { protocol: 'https', hostname: '**.picsum.photos' },
  { protocol: 'https', hostname: 'picsum.photos' },
  ],
},
  i18n: {
    defaultLocale: 'de',
    locales: ['en', 'de'],
    routing: {
      prefixDefaultLocale: false, 
    },
  },
});