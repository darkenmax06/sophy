import es from './translations/es';
import en from './translations/en';
import fr from './translations/fr';
import pt from './translations/pt';
import { type Locale, locales, defaultLocale } from './locales';

const translations: Record<Locale, any> = { es, en, fr, pt };

export function getTranslations(lang: Locale) {
  return translations[lang] ?? translations[defaultLocale];
}

export function getLocalizedUrl(lang: Locale, path: string): string {
  return `/${lang}${path.startsWith('/') ? path : '/' + path}`;
}

export function switchLangInPath(currentPath: string, newLang: Locale): string {
  const segments = currentPath.split('/').filter(Boolean);
  console.log('Current path segments:', segments);
  if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
    segments[0] = newLang;
    console.log('Updated path segments:', segments);
  } else {
    segments.unshift(newLang);
  }
  return '/' + segments.join('/');
}

export { type Locale, locales, defaultLocale } from './locales';
