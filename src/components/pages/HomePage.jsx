import { AboutSnippet } from '../home/AboutSnippet';
import { FeaturedCategories } from '../home/FeaturedCategories';
import { GallerySnippet } from '../home/GallerySnippet';
import { HeroCarousel } from '../home/HeroCarousel';
import { OffersSnippet } from '../home/OffersSnippet';
import { VisitBlock } from '../home/VisitBlock';

export function HomePage({ data }) {
  return (
    <>
      <HeroCarousel slides={data.heroSlides} whatsappHref={data.business.whatsappHref} />
      <FeaturedCategories categories={data.categories} />
      <AboutSnippet business={data.business} />
      <OffersSnippet offers={data.offers} />
      <GallerySnippet galleryImages={data.galleryImages} />
      <VisitBlock business={data.business} />
    </>
  );
}
