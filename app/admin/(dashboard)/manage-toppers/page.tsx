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

export default function ManageToppersPage() {
  const [toppers, setToppers] = useState<CloudinaryUploadResponse[]>([]);

  const handleImageUpload = (imageData: CloudinaryUploadResponse) => {
    setToppers([...toppers, imageData]);
  };

  const handleDeleteTopper = (publicId: string) => {
    setToppers(toppers.filter((topper) => topper.public_id !== publicId));
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Toppers</h1>
      <p className="text-slate-600 mb-8">Upload and manage topper profiles with images.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Add New Topper</h2>
            <ImageUpload
              folder="jkd-toppers"
              onUpload={handleImageUpload}
            />
          </div>
        </div>

        {/* Toppers List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                Toppers ({toppers.length})
              </h2>
            </div>

            {toppers.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-500">No toppers added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                {toppers.map((topper) => (
                  <div
                    key={topper.public_id}
                    className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={topper.secure_url}
                      alt="Topper"
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 flex items-center justify-between">
                      <p className="text-sm text-slate-600 truncate">
                        {topper.public_id.split('/').pop()}
                      </p>
                      <button
                        onClick={() => handleDeleteTopper(topper.public_id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
