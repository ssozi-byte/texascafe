export function GalleryGrid({ images, large = false }) {
  return (
    <div className="gallery-grid">
      {images.map((src, index) => (
        <div key={`${src}-${index}`} className={`gallery-item${large ? ' large' : ''}`}>
          <img src={src} alt={`Food or café ambience ${index + 1}`} loading="lazy" />
        </div>
      ))}
    </div>
  );
}
