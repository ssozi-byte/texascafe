import { GalleryGrid } from '../ui/GalleryGrid';
import { SectionHeader } from '../ui/SectionHeader';

export function GalleryPage({ data }) {
  return (
    <section className="page-shell container">
      <SectionHeader eyebrow="Gallery" title="Moments from the café." dark as="h1" />
      <GalleryGrid images={data.galleryImages} large />
    </section>
  );
}
