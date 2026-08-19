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
  },
  en: {
    homePage: homeEn,
    header: headerEn,
    footer: footerEn,
    newsletter: newsletterEn,
    meta: metaEn
  },
};

export function useTranslations(lang) {
  return function t(namespace, key) {
    const dict = translations[lang]?.[namespace] ?? {};
    const fallbackDict = translations[defaultLang]?.[namespace] ?? {};

    const getByPath = (obj, path) =>
      path.split('.').reduce((acc, part) => acc?.[part], obj);

    return getByPath(dict, key) ?? getByPath(fallbackDict, key) ?? key;
  };
}