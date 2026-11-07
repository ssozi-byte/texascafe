import { AboutSnippet } from '../home/AboutSnippet';
import { ExperienceHighlights } from '../home/ExperienceHighlights';
import { FeaturedCategories } from '../home/FeaturedCategories';
import { GallerySnippet } from '../home/GallerySnippet';
import { HeroCarousel } from '../home/HeroCarousel';
import { MenuHighlights } from '../home/MenuHighlights';
import { OffersSnippet } from '../home/OffersSnippet';
import { VisitBlock } from '../home/VisitBlock';

export function HomePage({ data }) {
  return (
    <>
      <HeroCarousel slides={data.heroSlides} whatsappHref={data.business.whatsappHref} />
      <FeaturedCategories categories={data.categories} />
      <ExperienceHighlights pillars={data.experiencePillars} stats={data.homeStats} />
      <MenuHighlights menuItems={data.menuItems} />
      <AboutSnippet business={data.business} />
      <OffersSnippet offers={data.offers} />
      <GallerySnippet galleryImages={data.galleryImages} />
      <VisitBlock business={data.business} />
    </>
  );
}
