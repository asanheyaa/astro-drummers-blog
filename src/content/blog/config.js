import { defineCollection } from 'astro:content';
import { getBlogArticles } from '../../services/blogService.js'
export const blogCollection = defineCollection({
  loader: getBlogArticles,
  
});

