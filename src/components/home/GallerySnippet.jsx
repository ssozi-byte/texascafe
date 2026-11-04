import { GalleryGrid } from '../ui/GalleryGrid';
import { SectionHeader } from '../ui/SectionHeader';

export function GallerySnippet({ galleryImages }) {
  return (
    <section className="gallery-section container">
      <SectionHeader eyebrow="Gallery" title="Food, drinks and good company." dark />
      <GalleryGrid images={galleryImages} />
    </section>
  );
}
