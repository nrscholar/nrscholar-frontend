import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enJSON from './locales/en.json';
import hiJSON from './locales/hi.json';
import guJSON from './locales/gu.json';
import { APP_CONFIG } from './config';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: enJSON,
      hi: hiJSON,
      gu: guJSON
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
      defaultVariables: { brandName: APP_CONFIG.brandName }
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
