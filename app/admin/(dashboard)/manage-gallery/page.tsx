'use client';

import { useState } from 'react';
import ImageUpload from '@/components/image-upload';
import { Trash2 } from 'lucide-react';

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}

export default function ManageGalleryPage() {
  const [galleryImages, setGalleryImages] = useState<CloudinaryUploadResponse[]>([]);

  const handleImageUpload = (imageData: CloudinaryUploadResponse) => {
    setGalleryImages([...galleryImages, imageData]);
  };

  const handleDeleteImage = (publicId: string) => {
    setGalleryImages(galleryImages.filter((img) => img.public_id !== publicId));
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Gallery</h1>
      <p className="text-slate-600 mb-8">Upload and organize your gallery images.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Add Images</h2>
            <ImageUpload
              folder="jkd-gallery"
              onUpload={handleImageUpload}
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

            {galleryImages.length === 0 ? (
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
                    <button
                      onClick={() => handleDeleteImage(image.public_id)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
