export function getLink(path) {
  // Отримуємо базовий URL (на комп'ютері це '/', на GitHub — '/astro-drummers-blog/')
  const base = import.meta.env.BASE_URL;
  
  // Обрізаємо зайві косі риски, щоб не було дублів на кшталт //blog
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return base.endsWith('/') ? `${base}${cleanPath}` : `${base}/${cleanPath}`;
}