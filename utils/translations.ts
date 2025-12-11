import { Language } from '../types';

export const translations = {
  en: {
    nav: {
      home: "Home",
      cafes: "Cafes",
      partner: "Partner Access",
      explore: "Explore"
    },
    hero: {
      badge: "Exclusive Coffee Rewards",
      title: "Sip More,\nSave More.",
      subtitle: "Unlock up to 30% off at Jordan's top roasteries. Your daily ritual, now rewarded.",
      searchPlaceholder: "Search cafes, offers...",
      allJordan: "All Jordan",
      nearMe: "Near Me",
      search: "Find Offers",
      promoCard: {
        title: "Daily Perk",
        discount: "20% OFF",
        desc: "On all V60 brews"
      }
    },
    stats: {
      curated: "Curated Offers",
      partner: "Partner Roasteries",
      searchResults: "Search Results",
      findNearMe: "Find Near Me",
      brewing: "Brewing results..."
    }
  },
  ar: {
    nav: {
      home: "الرئيسية",
      cafes: "العروض",
      partner: "دخول الشركاء",
      explore: "اكتشف"
    },
    hero: {
      badge: "مكافآت قهوة حصرية",
      title: "اشرب أكثر،\nووفر أكثر.",
      subtitle: "احصل على خصومات تصل لـ ٣٠٪ في أفضل محامص الأردن. قهوتك اليومية، بمكافآت أكثر.",
      searchPlaceholder: "ابحث عن مقاهي، عروض...",
      allJordan: "كل الأردن",
      nearMe: "الأقرب إلي",
      search: "جد العروض",
      promoCard: {
        title: "عرض اليوم",
        discount: "خصم ٢٠٪",
        desc: "على جميع أنواع V60"
      }
    },
    stats: {
      curated: "عروض مميزة",
      partner: "محامص شريكة",
      searchResults: "نتائج البحث",
      findNearMe: "الأقرب إلي",
      brewing: "جاري البحث..."
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];