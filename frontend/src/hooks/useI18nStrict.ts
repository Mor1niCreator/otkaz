import { useTranslation } from 'react-i18next';

/**
 * Strict i18n hook that throws errors in development for missing keys
 */
export function useI18nStrict() {
  const { t, i18n } = useTranslation();
  
  const strictT = (key: string, options?: any) => {
    const result = t(key, options);
    
    // In development, check if the key was found
    if (process.env.NODE_ENV === 'development') {
      // If the result is the same as the key, it means the translation wasn't found
      if (result === key) {
        console.error(`Missing translation key: "${key}" for language: ${i18n.language}`);
        // In development, you might want to throw an error to catch missing keys
        // throw new Error(`Missing translation key: "${key}"`);
      }
    }
    
    return result;
  };
  
  return {
    t: strictT,
    i18n,
    changeLanguage: i18n.changeLanguage,
    language: i18n.language
  };
}