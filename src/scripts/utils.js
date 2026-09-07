export function withBase(path) {
  const base = import.meta.env.BASE_URL;
  
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
}

export function getFilteredArticles(articles, lang, limit = null) {
  const filteredArticles = articles
   .filter((a) => a.data.lang === lang)
  .sort((a, b) => parseDate(b.data.date) - parseDate(a.data.date))
  if (limit) {
    return filteredArticles.slice(0, limit)
  } 
  else {
    return filteredArticles
  }
}



export function getPostLink(slug, lang) {
   if (!lang) {
    throw new Error('getPostLink: lang is required');
  }
 return lang === 'de' ? withBase(`/blog/${slugify(slug.toLowerCase())}`): withBase(`/en/blog/${slugify(slug.toLowerCase())}`)
}
export function getCommentsLink(slug, lang, commentsCounter) {
   if (commentsCounter > 0) {
    return lang === 'de' ? withBase(`/blog/${slugify(slug.toLowerCase())}#comments`): withBase(`/en/blog/${slugify(slug.toLowerCase())}#comments`)
  }
 return lang === 'de' ? withBase(`/blog/${slug}#commentForm`): withBase(`/en/blog/${slug}#commentForm`)
}

export function getCategoryLink(category, lang) {
   if (!lang) {
    throw new Error('getCategoryLink: lang is required');
  }
 return lang === 'de' ? withBase(`/blog/category/${slugify(category.toLowerCase())}`): withBase(`/en/blog/category/${slugify(category.toLowerCase())}`)
}
export function getPostShareLink(slug, lang, siteUrl) {
  if (!lang) throw new Error('getPostShareLink: lang is required');
  if (!slug) throw new Error('getPostShareLink: slug is required');

  const postUrl = getPostLink(slug, lang);
  const fullUrl = new URL(postUrl, siteUrl).href;

  return 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(fullUrl);
}



export const slugify = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/ö/g, "oe")
    .replace(/ä/g, "ae")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9 -]/g, "") 
    .replace(/\s+/g, "-")       
    .replace(/-+/g, "-");    
};


export function getCategoriesWithPosts(posts, lang) {
  const langPosts = posts.filter((post) => post.data.lang === lang);

  const rawCategoriesObjects = langPosts.flatMap((post) => {
    const additionalCats =
      post.data.additionalsCategories?.map((cat) => ({
        id: cat.id,
        title: cat.title,
        slug: slugify(cat.title),
      })) || [];

    const mainCat = post.data.mainCategory
      ? {
          id: post.data.translationId,
          title: post.data.mainCategory,
          slug: slugify(post.data.mainCategory),
        }
      : null;

    return mainCat ? [mainCat, ...additionalCats] : additionalCats;
  });

  const uniqueCategoriesMap = new Map();
  rawCategoriesObjects.forEach((cat) => {
    if (cat && cat.slug) {
      uniqueCategoriesMap.set(cat.slug, { id: cat.id, title: cat.title });
    }
  });

  return Array.from(uniqueCategoriesMap.entries()).map(([slug, catData]) => {
    const posts = langPosts.filter((post) => {
      const hasMain =
        post.data.mainCategory && slugify(post.data.mainCategory) === slug;
      const hasAdditional = post.data.additionalsCategories?.some(
        (cat) => slugify(cat.title) === slug
      );
      return hasMain || hasAdditional;
    }).sort((a, b) => parseDate(b.data.date) - parseDate(a.data.date));
    
    return { slug, title: catData.title, id: catData.id, posts };
  });
}

export function paginateItems(items, currentPage, pageSize = 10) {
  const lastPage = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), lastPage);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    currentPage: safePage,
    lastPage,
    total: items.length,
  };
}

export function parseDate(dateStr) {
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return new Date(dateStr).getTime(); 
  }
  const [day, month, year] = dateStr.split(".").map(Number);
  const fullYear = year < 100 ? 2000 + year : year;
  return new Date(fullYear, month - 1, day).getTime();
}