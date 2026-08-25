import homeEn from '../translations/home-page/en.json';
import homeDe from '../translations/home-page/de.json';
import headerEn from '../translations/main-sections/header/en.json';
import headerDe from '../translations/main-sections/header/de.json';
import footerEn from '../translations/main-sections/footer/en.json';
import footerDe from '../translations/main-sections/footer/de.json';
import newsletterEn from '../translations/main-sections/newsletter/en.json';
import newsletterDe from '../translations/main-sections/newsletter/de.json';
import metaDe from '../translations/main-sections/meta/de.json';
import metaEn from '../translations/main-sections/meta/en.json';
import blogDe from '../translations/blog/de.json';
import blogEn from '../translations/blog/en.json';
import singlePostDe from '../translations/single-post/de.json';
import singlePostEn from '../translations/single-post/en.json';

export const languages = {
  de: 'Deutsch',
  en: 'English',
};

export const defaultLang = 'de';

const translations = {
  de: {
    homePage: homeDe,
    header: headerDe,
    footer: footerDe,
    newsletter: newsletterDe,
    meta: metaDe,
    blog: blogDe,
    singlePost: singlePostDe
  },
  en: {
    homePage: homeEn,
    header: headerEn,
    footer: footerEn,
    newsletter: newsletterEn,
    meta: metaEn,
    blog: blogEn,
    singlePost: singlePostEn
  },
};

export function useTranslations(lang) {
  return function t(namespace, key, params = {}) {
    const dict = translations[lang]?.[namespace] ?? {};
    const fallbackDict = translations[defaultLang]?.[namespace] ?? {};

    const getByPath = (obj, path) =>
      path.split('.').reduce((acc, part) => acc?.[part], obj);

    const raw = getByPath(dict, key) ?? getByPath(fallbackDict, key) ?? key;

    if (typeof raw !== 'string') return raw;

    return raw.replace(/{(\w+)}/g, (match, paramKey) =>
      paramKey in params ? String(params[paramKey]) : match
    );
  };
}