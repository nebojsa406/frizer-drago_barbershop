import { useState, useRef } from "react";
import { uploadPhotos, deletePhoto } from "../../../api/gallery";
import { toast } from "react-toastify";

export function GalleryAdminPanel({ gallery = [], setGallery, onAddingChange }) {
    const wrapperRef = useRef(null);

    const [isAdding, setIsAdding] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [newImages, setNewImages] = useState([]);

    const photoItems = [
        ...newImages.map((photo) => ({ ...photo, isNew: true })),
        ...gallery,
    ];
    const photoUrls = photoItems.map((photo) => photo.imageUrl);
    const [selectedPhoto, setSelectedPhoto] = useState(photoUrls ? photoUrls[0] : null);
    const displayedPhoto = photoUrls.includes(selectedPhoto) ? selectedPhoto : photoUrls[0];
    const [category, setCategory] = useState("");
    const [imageFiles, setImageFiles] = useState([]);

    async function addImages(files) {
        const filteredFiles = Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));
        if (filteredFiles.length === 0) return;
        setImageFiles((currentFiles) => [...filteredFiles, ...currentFiles]);

        try {
            const images = []
            for (const file of filteredFiles) {
                const newImage = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
                images.push({ category: "interior", imageUrl: newImage });
            }
            setNewImages((currentImages) => [...images, ...currentImages]);
            setSelectedPhoto(images[0].imageUrl);

        } catch (err) {
            console.error("Could not read images", err);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        addImages(event.dataTransfer.files);
    };

    function handleOpenClose() {
        const nextIsAdding = !isAdding;
        setIsAdding(nextIsAdding);
        onAddingChange(nextIsAdding);
        setCategory("");
        if (!nextIsAdding) {
            setNewImages([]);
            setImageFiles([]);
        }
    }

    async function handleSubmit() {
        if (!category || newImages.length === 0) return;
        await uploadPhotos(imageFiles, category);
        setImageFiles([]);
        setGallery((currentGallery) => [
            ...newImages.map((photo) => ({ ...photo, category })),
            ...currentGallery,
        ]);
        setNewImages([]);
        setIsAdding(false);
        onAddingChange(false);
        setCategory("");
    }

    function handleDelete() {
        let id = null;
        if (selectedPhoto) {
            for (const photo of gallery) {
                if (selectedPhoto === photo.imageUrl) {
                    id = photo._id;
                }
            }
        } else {
            return toast("failed to delete photo", { className: "errorToast", progressClassName: "errorProgress" });
        }

        deletePhoto(id);
    }

    function toggleFullScreen() {
        const ele = wrapperRef.current;
        if (!document.fullscreenElement) {
            ele.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }

    return (
        <div className={`gallery-admin-panel${isAdding ? " is-adding" : ""}`}>
            <div className="gallery-admin-actions">
                {isAdding && (
                    <>
                        <p className="gallery-category-label">Select category for new images</p>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="gallery-category-select" name="categorys">
                            <option value="">SELECT CATEGORY</option>
                            <option value="interior">INTERIOR</option>
                            <option value="exterior">EXTERIOR</option>
                        </select>
                        <button
                            className="gallery-delete-btn"
                            type="button"
                            onClick={() => handleDelete()}
                        >
                            DELETE
                        </button>
                        <button
                            className="gallery-submit-btn"
                            type="button"
                            disabled={!category}
                            onClick={() => handleSubmit()}
                        >
                            SUBMIT
                        </button>
                    </>
                )}

                <button
                    className="gallery-add-btn"
                    type="button"
                    onClick={() => handleOpenClose()}
                >
                    {!isAdding ? "EDIT GALLERY" : "CLOSE"}
                </button>
            </div>

            {isAdding && (
                <div
                    className={`gallery-upload-zone${isDragging ? " is-dragging" : ""}`}
                    onDragEnter={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={(event) => {
                        if (event.currentTarget === event.target) setIsDragging(false);
                    }}
                    onDrop={handleDrop}
                >
                    <input
                        id="gallery-photo-upload"
                        className="gallery-file-input"
                        type="file"
                        accept="image/*"
                        onChange={(event) => addImages(event.target.files)}
                    />
                    <label htmlFor="gallery-photo-upload" className="gallery-upload-label">
                        <strong>DROP IMAGES HERE</strong>
                        <span>or select from your device</span>
                    </label>
                </div>
            )}

            <div className="gallery-selected-photo" ref={wrapperRef} onClick={toggleFullScreen}>
                {displayedPhoto ? <img src={displayedPhoto} alt="Selected gallery photo" loading="lazy" /> : null}
            </div>

            {photoUrls.length > 0 && (
                <div className="gallery-photo-thumbnails" aria-label="Gallery photos">
                    {photoItems.map((photoItem, index) => (
                        <button
                            className={`gallery-photo-thumbnail${photoItem.isNew ? " is-new" : ""}${photoItem.imageUrl === displayedPhoto ? " is-selected" : ""}`}
                            type="button"
                            key={`${photoItem.imageUrl}-${index}`}
                            onClick={() => setSelectedPhoto(photoItem.imageUrl)}
                            aria-label={`Show gallery photo ${index + 1}`}
                            aria-pressed={photoItem.imageUrl === displayedPhoto}
                        >
                            <img src={photoItem.imageUrl} alt="" loading="lazy" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}