import homeEn from '../translations/home-page/en.json';
import homeDe from '../translations/home-page/de.json';
import headerEn from '../translations/main-sections/header/en.json';
import headerDe from '../translations/main-sections/header/de.json';
import footerEn from '../translations/main-sections/footer/en.json';
import footerDe from '../translations/main-sections/footer/de.json';
import categoriesDe from '../translations/main-sections/categories/de.json';
import categoriesEn from '../translations/main-sections/categories/en.json';
import newsletterEn from '../translations/main-sections/newsletter/en.json';
import newsletterDe from '../translations/main-sections/newsletter/de.json';
import blogDe from '../translations/blog/de.json';
import blogEn from '../translations/blog/en.json';
import singlePostDe from '../translations/single-post/de.json';
import singlePostEn from '../translations/single-post/en.json';
import productsDe from '../translations/products/de.json';
import productsEn from '../translations/products/en.json';
import cartDe from '../translations/cart/de.json';
import cartEn from '../translations/cart/en.json';
import findYourWayDe from '../translations/find-your-way-through-the-music/de.json';
import findYourWayEn from '../translations/find-your-way-through-the-music/en.json';
import rudimentsDe from '../translations/rudiments-the-complete-collection/de.json';
import rudimentsEn from '../translations/rudiments-the-complete-collection/en.json';

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
    blog: blogDe,
    singlePost: singlePostDe,
    categories: categoriesDe,
    products: productsDe,
    cart:cartDe,
    findYourWay:findYourWayDe,
    rudiments: rudimentsDe,
  },
  en: {
    homePage: homeEn,
    header: headerEn,
    footer: footerEn,
    newsletter: newsletterEn,
    blog: blogEn,
    singlePost: singlePostEn,
    categories: categoriesEn,
    products: productsEn,
    cart:cartEn,
    findYourWay:findYourWayEn,
    rudiments: rudimentsEn,
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