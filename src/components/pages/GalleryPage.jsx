import { GalleryGrid } from '../ui/GalleryGrid';

export function GalleryPage({ data }) {
  return (
    <div className="gallery-page">
      <div className="page-hero" style={{ backgroundImage: 'linear-gradient(rgba(17,17,17,0.45),rgba(17,17,17,0.6)),url(/images/cafe-food-spread.jpg)' }}>
        <div className="container page-hero-content">
          <span className="eyebrow">Gallery</span>
          <h1>Moments from the café.</h1>
          <p>A taste of what's waiting for you at Kim's Texas Caffe.</p>
        </div>
      </div>
      <section className="page-shell container">
        <GalleryGrid images={data.galleryImages} large />
      </section>
    </div>
  );
}
