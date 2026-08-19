const BASE_URL = 'https://fakestoreapi.com';


function mapArticle(raw) {
  return {
    slug: String(raw.id),        
    title: raw.title,
    description: raw.description,
    cover: raw.image,
    date: raw.price,
    category: raw.category,
    alt: 'image',
    categoryUrl: '#',
    postUrl:'#'
  };
}

export async function getBlogArticles(limit = 5) {
  try {
    const response = await fetch(`${BASE_URL}/products?limit=${limit}`);
    if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);
    const data = await response.json();
    return data.map(mapArticle); 
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return [];
  }
}