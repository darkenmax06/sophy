export const defaultLocale = 'es';
export const locales = ['es', 'en', 'fr', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
  fr: 'FR',
  pt: 'PT',
};
