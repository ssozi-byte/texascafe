import { useEffect, useState } from 'react';
import {
  business as fallbackBusiness,
  categories as fallbackCategories,
  experiencePillars as fallbackExperiencePillars,
  galleryImages as fallbackGallery,
  heroSlides as fallbackHeroSlides,
  homeStats as fallbackHomeStats,
  menuItems as fallbackMenuItems,
  offers as fallbackOffers,
} from '../data/siteData';
import { fetchJson } from '../services/siteApi';

export function useCafeData() {
  const [siteData, setSiteData] = useState({
    business: fallbackBusiness,
    heroSlides: fallbackHeroSlides,
    categories: fallbackCategories,
    menuItems: fallbackMenuItems,
    offers: fallbackOffers,
    galleryImages: fallbackGallery,
    experiencePillars: fallbackExperiencePillars,
    homeStats: fallbackHomeStats,
  });

  useEffect(() => {
    let active = true;

    Promise.all([
      fetchJson('/api/business', fallbackBusiness),
      fetchJson('/api/hero', fallbackHeroSlides),
      fetchJson('/api/categories', fallbackCategories),
      fetchJson('/api/menu', fallbackMenuItems),
      fetchJson('/api/offers', fallbackOffers),
      fetchJson('/api/gallery', fallbackGallery),
      fetchJson('/api/experience', fallbackExperiencePillars),
      fetchJson('/api/stats', fallbackHomeStats),
    ])
      .then(([business, heroSlides, categories, menuItems, offers, galleryImages, experiencePillars, homeStats]) => {
        if (!active) return;
        setSiteData({ business, heroSlides, categories, menuItems, offers, galleryImages, experiencePillars, homeStats });
      })
      .catch((error) => {
        console.warn('Unable to hydrate cafe data from API, keeping fallback content.', error);
      });

    return () => { active = false; };
  }, []);

  return siteData;
}
