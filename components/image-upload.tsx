'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
}

interface ImageUploadProps {
  onUpload: (imageData: CloudinaryUploadResponse) => void;
  folder?: string;
  maxSize?: number; // in MB
  serverAction?: (formData: FormData) => Promise<{
    success: boolean;
    data?: { id: string; secure_url: string; public_id: string };
    error?: string;
  }>;
}

export default function ImageUpload({
  onUpload,
  folder = 'jkd-admin',
  maxSize = 5,
  serverAction,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    try {
      setError('');
      
      // PHASE 2: STRICT CLIENT-SIDE VALIDATION
      
      // 1. Check if file exists
      if (!file) {
        setError('Error: Please select an image file');
        return;
      }

      // 2. Restrict MIME types to images only
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validMimeTypes.includes(file.type)) {
        setError('Error: Please upload a JPG, PNG, or WebP image file');
        return;
      }

      // 3. Restrict file size to strictly <= 5MB
      const maxSizeBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeBytes) {
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
        setError(`Error: Please upload an image smaller than 5MB (your file is ${fileSizeMB}MB)`);
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setIsLoading(true);

      let data: CloudinaryUploadResponse;

      if (serverAction) {
        // Use server action (for Firebase integration)
        console.log('[ImageUpload] Using server action for upload');
        const formData = new FormData();
        formData.append('file', file);

        const response = await serverAction(formData);

        if (!response.success) {
          console.error('[ImageUpload] Server action error:', response.error);
          throw new Error(response.error || 'Upload failed');
        }

        if (!response.data) {
          throw new Error('No data returned from server');
        }

        data = response.data;
      } else {
        // Direct Cloudinary upload (fallback for client-side only)
        console.log('[ImageUpload] Using direct Cloudinary upload');
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'jkd_admin');
        formData.append('folder', folder);
        formData.append('resource_type', 'auto');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          console.error('[ImageUpload] Cloudinary upload failed:', response.statusText);
          throw new Error('Upload failed');
        }

        data = await response.json();
      }

      // Only reset loading state AFTER successful upload and Firestore save (if using server action)
      onUpload(data);
      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('[ImageUpload] Upload error:', err);
      // Display clean, user-friendly error message
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(`Error: ${errorMessage}`);
    } finally {
      // Reset loading state after operation completes (success or error)
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
