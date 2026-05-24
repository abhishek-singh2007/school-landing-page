'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
}

interface ImageUploadProps {
  onUpload: (imageData: CloudinaryUploadResponse) => void;
  folder?: string;
  maxSize?: number; // in MB
}

export default function ImageUpload({
  onUpload,
  folder = 'jkd-admin',
  maxSize = 5,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setError('');
      
      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`);
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setIsLoading(true);

      // Create FormData for Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'jkd_admin'); // Create this in Cloudinary dashboard
      formData.append('folder', folder);
      formData.append('resource_type', 'auto');

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data: CloudinaryUploadResponse = await response.json();
      onUpload(data);
      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragAndDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDragAndDrop}
        className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-yellow-400 transition-colors cursor-pointer bg-slate-50"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="relative">
            <Image
              src={preview}
              alt="Preview"
              width={200}
              height={200}
              className="mx-auto mb-4 rounded-lg max-h-48"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <p className="text-slate-900 font-semibold mb-1">
              Drag and drop your image here
            </p>
            <p className="text-slate-600 text-sm mb-4">
              or click to browse (Max {maxSize}MB)
            </p>
          </div>
        )}

        {isLoading && (
          <p className="text-yellow-600 font-medium mt-2">Uploading...</p>
        )}

        {error && (
          <p className="text-red-600 font-medium mt-2">{error}</p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        }}
        className="hidden"
      />
    </div>
  );
}
