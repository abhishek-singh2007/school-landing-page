'use client';

import { useState, useEffect } from 'react';
import ImageUpload from '@/components/image-upload';
import { uploadGalleryImage } from '@/app/actions/uploadGalleryImage';
import { toggleFeaturedImage } from '@/app/actions/getFeaturedImages';
import { Trash2, CheckCircle, AlertCircle, Star } from 'lucide-react';

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
}

interface GalleryImage extends CloudinaryUploadResponse {
  id: string;
  isFeatured?: boolean;
  created_at?: unknown;
}

export default function ManageGalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [toggleMessage, setToggleMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // PHASE 1: Load images from Firestore on mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        // TODO: In a real app, fetch from Firestore via a server action
        // For now, we'll load from uploads
        setIsLoading(false);
      } catch (error) {
        console.error('[ManageGalleryPage] Error loading images:', error);
        setIsLoading(false);
      }
    };
    loadImages();
  }, []);

  const handleImageUpload = async (imageData: CloudinaryUploadResponse & { id?: string }) => {
    try {
      console.log('[ManageGalleryPage] Image upload complete:', imageData);
      
      // Add to gallery list with Firestore doc ID
      const newImage: GalleryImage = {
        id: imageData.id || imageData.public_id,
        public_id: imageData.public_id,
        secure_url: imageData.secure_url,
        width: imageData.width,
        height: imageData.height,
        isFeatured: false, // Default: not featured
      };

      setGalleryImages([...galleryImages, newImage]);
      setUploadMessage({
        type: 'success',
        text: 'Image uploaded and saved to gallery successfully!',
      });

      // Clear message after 3 seconds
      setTimeout(() => setUploadMessage(null), 3000);
    } catch (error) {
      console.error('[ManageGalleryPage] Error in handleImageUpload:', error);
      setUploadMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to process upload',
      });
    }
  };

  // PHASE 1: Toggle featured status
  const handleToggleFeatured = async (docId: string, currentStatus: boolean) => {
    try {
      console.log('[ManageGalleryPage] Toggling featured for:', docId);
      
      const result = await toggleFeaturedImage(docId, currentStatus);
      
      if (!result.success) {
        setToggleMessage({
          type: 'error',
          text: result.error || 'Failed to toggle featured status',
        });
        return;
      }

      // Update local state
      setGalleryImages(
        galleryImages.map((img) =>
          img.id === docId
            ? { ...img, isFeatured: result.isFeatured || false }
            : img
        )
      );

      setToggleMessage({
        type: 'success',
        text: result.isFeatured ? 'Added to featured images!' : 'Removed from featured images!',
      });

      // Clear message after 3 seconds
      setTimeout(() => setToggleMessage(null), 3000);
    } catch (error) {
      console.error('[ManageGalleryPage] Error toggling featured:', error);
      setToggleMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to toggle featured status',
      });
    }
  };

  const handleDeleteImage = (publicId: string) => {
    setGalleryImages(galleryImages.filter((img) => img.public_id !== publicId));
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Gallery</h1>
      <p className="text-slate-600 mb-8">Upload and organize your gallery images. Star your favorite images to feature them on the homepage.</p>

      {/* Upload Status Message */}
      {uploadMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          uploadMessage.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {uploadMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-medium">{uploadMessage.text}</span>
        </div>
      )}

      {/* Toggle Status Message */}
      {toggleMessage && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
          toggleMessage.type === 'success'
            ? 'bg-blue-50 text-blue-800 border border-blue-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {toggleMessage.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-medium">{toggleMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Add Images</h2>
            <ImageUpload
              folder="jkd-gallery"
              onUpload={handleImageUpload}
              serverAction={uploadGalleryImage}
            />
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                Gallery Images ({galleryImages.length})
              </h2>
            </div>

            {isLoading ? (
              <div className="p-8 text-center">
                <p className="text-slate-500">Loading images...</p>
              </div>
            ) : galleryImages.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-500">No gallery images yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                {galleryImages.map((image) => (
                  <div
                    key={image.public_id}
                    className="relative group border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={image.secure_url}
                      alt="Gallery"
                      className="w-full h-32 object-cover"
                    />
                    {/* PHASE 1: Star button for featured images */}
                    <button
                      onClick={() => handleToggleFeatured(image.id, image.isFeatured || false)}
                      className="absolute top-1 left-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-100"
                      title={image.isFeatured ? 'Remove from featured' : 'Add to featured'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          image.isFeatured
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-400'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.public_id)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
