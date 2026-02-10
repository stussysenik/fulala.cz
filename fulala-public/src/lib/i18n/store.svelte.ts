import { browser } from '$app/environment';
import { translations, type Lang, type TranslationStrings } from './translations';

const STORAGE_KEY = 'fulala-lang';

function getInitialLang(): Lang {
  if (browser) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'cs' || stored === 'zh') return stored;
  }
  return 'cs'; // Default Czech
}

let lang = $state<Lang>(getInitialLang());

export function getLang(): Lang {
  return lang;
}

export function setLang(newLang: Lang) {
  lang = newLang;
  if (browser) {
    localStorage.setItem(STORAGE_KEY, newLang);
  }
}

export function toggleLang() {
  // Cycle: cs -> en -> zh -> cs
  const cycle: Lang[] = ['cs', 'en', 'zh'];
  const idx = cycle.indexOf(lang);
  setLang(cycle[(idx + 1) % cycle.length]);
}

export function getT(): TranslationStrings {
  return translations[lang];
}

// Re-export translations (lang is accessed via getLang/setLang)
export { translations };
