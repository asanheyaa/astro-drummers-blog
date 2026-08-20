const BASE_URL = 'https://drummersblog.de';

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').trim();
}

function formatDate(dateString, lang = 'de') {
  return new Date(dateString).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function isEnglishPost(link) {
  return new URL(link).pathname.startsWith('/en/');
}

function mapArticle(raw, lang) {
  const featuredMedia = raw._embedded?.['wp:featuredmedia']?.[0];
  const category = raw._embedded?.['wp:term']?.[0]?.[0];
  return {
    slug: raw.slug,
    title: stripHtml(raw.title.rendered),
    description: stripHtml(raw.excerpt.rendered),
    cover: featuredMedia?.source_url ?? null,
    date: formatDate(raw.date, lang),
    category: category?.name ?? null,
    alt: featuredMedia?.alt_text || stripHtml(raw.title.rendered),
    categoryUrl: '#',
    postUrl: '#',
  };
}

export async function getBlogArticles(limit = 5, lang = 'de') {
  try {
    const fetchLimit = Math.min(limit * 3, 100);

    const response = await fetch(
      `${BASE_URL}/wp-json/wp/v2/posts?per_page=${fetchLimit}&_embed`
    );
    if (!response.ok) throw new Error(`Failed to fetch data: ${response.status}`);

    const data = await response.json();

    const filtered = data.filter((post) =>
      lang === 'en' ? isEnglishPost(post.link) : !isEnglishPost(post.link)
    );

    return filtered.slice(0, limit).map((post) => mapArticle(post, lang));
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return [];
  }
}