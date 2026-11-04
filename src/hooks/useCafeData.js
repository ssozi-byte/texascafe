import { useEffect, useState } from 'react';
import {
  business as fallbackBusiness,
  categories as fallbackCategories,
  galleryImages as fallbackGallery,
  heroSlides as fallbackHeroSlides,
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
    ])
      .then(([business, heroSlides, categories, menuItems, offers, galleryImages]) => {
        if (!active) return;
        setSiteData({ business, heroSlides, categories, menuItems, offers, galleryImages });
      })
      .catch((error) => {
        console.warn('Unable to hydrate cafe data from API, keeping fallback content.', error);
      });

    return () => { active = false; };
  }, []);

  return siteData;
}
