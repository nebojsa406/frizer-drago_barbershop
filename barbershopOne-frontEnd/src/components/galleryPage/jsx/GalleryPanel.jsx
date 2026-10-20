import { useState } from "react";

export function GalleryPanel({ gallery = [] }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    
    const photoUrls = gallery.flatMap((photo) => { return photo.imageUrl } );

    const displayedPhoto = photoUrls.includes(selectedPhoto) ? selectedPhoto : photoUrls[0];

    return (
        photoUrls.length > 0 ? (
            <div className="gallery-viewer">
                <div className="gallery-selected-photo">
                    <img src={displayedPhoto} alt="Selected gallery photo" loading="lazy" />
                </div>

                <div className="gallery-photo-thumbnails" aria-label="Gallery photos">
                    {photoUrls.map((photo, index) => (
                        <button
                            className={`gallery-photo-thumbnail${photo === displayedPhoto ? " is-selected" : ""}`}
                            type="button"
                            key={`${photo}-${index}`}
                            onClick={() => setSelectedPhoto(photo)}
                            aria-label={`Show gallery photo ${index + 1}`}
                            aria-pressed={photo === displayedPhoto}
                        >
                            <img src={photo} alt="" loading="lazy" />
                        </button>
                    ))}
                </div>
            </div>
        ) : <p className="no-content-msg">no content available</p>
    );
}