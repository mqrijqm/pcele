import sr from './messages/sr.json';
import en from './messages/en.json';

export const locales = ['sr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'sr';

const dictionaries = { sr, en } as const;

export type Messages = typeof sr;

export function getMessages(locale: Locale): Messages {
  return (dictionaries[locale] ?? dictionaries[defaultLocale]) as Messages;
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Reads a dotted key out of the message tree, e.g. t('cart.empty').
 * Placeholders like {count} are filled from `values`.
 */
export function createTranslator(locale: Locale) {
  const messages = getMessages(locale);

  return function t(key: string, values?: Record<string, string | number>): string {
    const raw = key.split('.').reduce<unknown>((acc, part) => {
      if (acc && typeof acc === 'object' && part in (acc as object)) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, messages);

    if (typeof raw !== 'string') return key;
    if (!values) return raw;

    return raw.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in values ? String(values[name]) : match
    );
  };
}

export type Translator = ReturnType<typeof createTranslator>;

/** Prefixes an app path with the active locale: href('sr', '/products') → '/sr/products'. */
export function localeHref(locale: Locale, path: string): string {
  return path === '/' ? `/${locale}` : `/${locale}${path}`;
}
