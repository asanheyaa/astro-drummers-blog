import { defineCollection } from 'astro:content';
import {products} from '../../services/productService.js';
export const productsCollection = defineCollection({
  loader: () => products,
});

