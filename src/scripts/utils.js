export function withBase(path) {
  const base=import.meta.env.BASE_URL;

  const cleanPath=path.startsWith('/')? path.slice(1):path;

  return base.endsWith('/')? `${base}${cleanPath}`:`${base}/${cleanPath}`;
}

export function getFilteredArticles(articles,lang,limit=null) {
  const filteredArticles=articles
    .filter((a) => a.data.lang===lang)
    .sort((a,b) => parseDate(b.data.date)-parseDate(a.data.date))
  if(limit) {
    return filteredArticles.slice(0,limit)
  }
  else {
    return filteredArticles
  }
}



export function getPostLink(slug,lang) {
  if(!lang) {
    throw new Error('getPostLink: lang is required');
  }
  return lang==='de'? withBase(`/blog/${slugify(slug.toLowerCase())}`):withBase(`/en/blog/${slugify(slug.toLowerCase())}`)
}
export function getCommentsLink(slug,lang,commentsCounter) {
  if(commentsCounter>0) {
    return lang==='de'? withBase(`/blog/${slugify(slug.toLowerCase())}#comments`):withBase(`/en/blog/${slugify(slug.toLowerCase())}#comments`)
  }
  return lang==='de'? withBase(`/blog/${slug}#commentForm`):withBase(`/en/blog/${slug}#commentForm`)
}

export function getCategoryLink(category,lang) {
  if(!lang) {
    throw new Error('getCategoryLink: lang is required');
  }
  return lang==='de'? withBase(`/blog/category/${slugify(category.toLowerCase())}`):withBase(`/en/blog/category/${slugify(category.toLowerCase())}`)
}
export function getTagLink(category,lang) {
  if(!lang) {
    throw new Error('getCategoryLink: lang is required');
  }
  return lang==='de'? withBase(`/blog/tags/${slugify(category.toLowerCase())}`):withBase(`/en/blog/tags/${slugify(category.toLowerCase())}`)
}
export function getPostShareLink(slug,lang,siteUrl) {
  if(!lang) throw new Error('getPostShareLink: lang is required');
  if(!slug) throw new Error('getPostShareLink: slug is required');

  const postUrl=getPostLink(slug,lang);
  const fullUrl=new URL(postUrl,siteUrl).href;

  return 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(fullUrl);
}

export function getFormattedDate(dateStr) {
  const parts=dateStr.split('.');
  if(parts[2]&&parts[2].length===2) {
    parts[2]='20'+parts[2];
  }
  return parts.join('.');
}



export const slugify=(text) => {
  if(!text) return "";
  return text
    .toLowerCase()
    .replace(/ö/g,"oe")
    .replace(/ä/g,"ae")
    .replace(/ü/g,"ue")
    .replace(/ß/g,"ss")
    .replace(/[^a-z0-9 -]/g,"")
    .replace(/\s+/g,"-")
    .replace(/-+/g,"-");
};




function groupPostsById(posts,lang,getItems) {
  const byId=new Map();

  for(const post of posts) {
    if(post.data.lang!==lang) continue;

    const seen = new Set(); 
    for(const item of getItems(post)) {
      if(!item?.id||!item?.title||seen.has(item.id)) continue;
      seen.add(item.id);

      if(!byId.has(item.id)) {
        byId.set(item.id,{
          id: item.id,
          title: item.title,
          slug: slugify(item.title),
          posts: [],
        });
      }
      byId.get(item.id).posts.push(post);
    }
  }

  for(const entry of byId.values()) {
    entry.posts.sort((a,b) => parseDate(b.data.date)-parseDate(a.data.date));
  }

  return [...byId.values()];
}

export function getCategoriesWithPosts(posts,lang) {
  return groupPostsById(posts,lang,(post) => [post.data.category]);
}

export function getTagsWithPosts(posts,lang) {
  return groupPostsById(posts,lang,(post) => post.data.tags??[]);
}


export function parseDate(dateStr) {
  if(/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return new Date(dateStr).getTime();
  }
  const [day,month,year]=dateStr.split(".").map(Number);
  const fullYear=year<100? 2000+year:year;
  return new Date(fullYear,month-1,day).getTime();
}