// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config

export default defineConfig({
   site: 'https://asanheyaa.github.io',
  base: '/astro-drummers-blog',
  i18n: {
    defaultLocale: 'de',
    locales: ['en', 'de'],
    routing: {
      prefixDefaultLocale: false, 
    },
  },
});