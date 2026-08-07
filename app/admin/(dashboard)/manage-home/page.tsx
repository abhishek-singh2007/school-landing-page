'use client';

import { useState, useEffect } from 'react';
import { uploadHeroImage, deleteHeroImage, getHeroImages, getHeroMode, setHeroMode } from '@/app/actions/heroImages';
import type { HeroMode } from '@/app/actions/heroImages';
import { Upload, Trash2, Loader2, LayoutGrid, Monitor, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface HeroImage {
  id: string;
  public_id: string;
  secure_url: string;
  heading: string;
  subheading: string;
  width: number;
  height: number;
}

export default function ManageHomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isSavingMode, setIsSavingMode] = useState(false);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [heroMode, setHeroModeState] = useState<HeroMode>('dynamic');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch hero images on mount
  useEffect(() => {
    void fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    await Promise.all([fetchImages(), fetchHeroModeSetting()]);
  };

  const fetchImages = async () => {
    try {
      setIsLoadingImages(true);
      console.log('[fetchImages] Fetching images from Firebase...');
      const images = await getHeroImages();
      console.log('[fetchImages] Received', images.length, 'images from Firebase');
      setHeroImages(images);
    } catch (err) {
      console.error('[fetchImages] Error fetching images:', err);
      setError('Failed to load images');
    } finally {
      setIsLoadingImages(false);
    }
  };

  const fetchHeroModeSetting = async () => {
    try {
      const result = await getHeroMode();
      if (result.success && result.data) {
        setHeroModeState(result.data);
      }
    } catch (err) {
      console.error('[fetchHeroModeSetting] Error fetching hero mode:', err);
    }
  };

  const handleHeroModeChange = async (mode: HeroMode) => {
    setError('');
    setSuccess('');
    setIsSavingMode(true);

    try {
      const result = await setHeroMode(mode);

      if (result.success && result.data) {
        setHeroModeState(result.data);

        if (process.env.NODE_ENV !== 'production') {
          document.cookie = `hero_mode_override=${result.data}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
        }

        setSuccess(`Hero mode updated to ${result.data === 'static' ? 'Static' : 'Dynamic'}.`);
      } else {
        setError(result.error || 'Failed to update hero mode');
      }
    } catch (err) {
      console.error('[handleHeroModeChange] Unexpected error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update hero mode');
    } finally {
      setIsSavingMode(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setSuccess('');
    
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Only JPG, PNG, and WebP images are allowed.');
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (selectedFile.size > maxSize) {
        setError('File size must be less than 5MB. Your file is ' + (selectedFile.size / (1024 * 1024)).toFixed(2) + 'MB.');
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Final validation before upload
    if (!file) {
      setError('Please select an image file');
      return;
    }

    // Validate file size one more time (client-side safety check)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size must be less than 5MB. Your file is ' + (file.size / (1024 * 1024)).toFixed(2) + 'MB.');
      return;
    }

    // Validate file type one more time
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Only JPG, PNG, and WebP images are allowed.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('heading', heading);
      formData.append('subheading', subheading);

      console.log('[handleSubmit] Calling uploadHeroImage...');
      const result = await uploadHeroImage(formData);

      if (result.success) {
        console.log('[handleSubmit] Upload successful:', result.data);
        setSuccess('Hero image uploaded successfully!');
        
        // Clear form
        setFile(null);
        setHeading('');
        setSubheading('');
        setPreviewUrl(null);
        
        // Reset file input
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (input) input.value = '';
        
        // Re-fetch images from Firebase to ensure UI reflects database state
        console.log('[handleSubmit] Re-fetching images from Firebase...');
        await fetchImages();
        console.log('[handleSubmit] Images re-fetched successfully');
      } else {
        console.error('[handleSubmit] Upload failed:', result.error);
        setError(result.error || 'Failed to upload image. Please try again.');
      }
    } catch (err) {
      console.error('[handleSubmit] Unexpected error during upload:', err);
      
      // Provide user-friendly error messages for common errors
      if (err instanceof Error) {
        if (err.message.includes('network') || err.message.includes('fetch')) {
          setError('Network error. Please check your connection and try again.');
        } else if (err.message.includes('timeout')) {
          setError('Upload timed out. The file may be too large. Please try again.');
        } else {
          setError('Error uploading image: ' + err.message);
        }
      } else {
        setError('An unexpected error occurred during upload. Please try again.');
      }
    } finally {
      // Always reset loading state, even if there's an error
      setIsLoading(false);
      console.log('[handleSubmit] Upload process completed, loading state reset');
    }
  };

  const handleDelete = async (publicId: string, docId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('[handleDelete] Deleting image:', { publicId, docId });
      const result = await deleteHeroImage(publicId, docId);

      if (result.success) {
        console.log('[handleDelete] Deletion successful');
        setSuccess('Image deleted successfully!');
        console.log('[handleDelete] Re-fetching images from Firebase...');
        await fetchImages();
        console.log('[handleDelete] Images re-fetched successfully');
      } else {
        console.error('[handleDelete] Deletion failed:', result.error);
        setError(result.error || 'Failed to delete image');
      }
    } catch (err) {
      console.error('[handleDelete] Unexpected error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      console.log('[handleDelete] Delete process completed, loading state reset');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Manage Homepage
        </h1>
        <p className="text-sm sm:text-base text-slate-600">Upload and manage hero carousel images for your homepage.</p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-4 sm:mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm sm:text-base text-red-700 font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 sm:mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm sm:text-base text-green-700 font-medium">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Upload Form */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden sticky top-4 sm:top-6 md:top-8">
            <div className="bg-slate-900 px-4 sm:px-6 py-4">
              <h2 className="text-base sm:text-lg font-bold text-white">Upload Hero Image</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              {/* File Input */}
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-slate-900 mb-2">
                  Image File
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-400 transition-colors">
                  <input
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    {previewUrl ? (
                      <div className="relative h-32 mx-auto mb-2">
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="py-8">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm text-slate-600 font-medium">
                          {file ? file.name : 'Click to upload'}
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Heading Input */}
              <div>
                <label htmlFor="heading" className="block text-sm font-medium text-slate-900 mb-2">
                  Heading (Optional)
                </label>
                <input
                  type="text"
                  id="heading"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="e.g., Excellence in Education"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Subheading Input */}
              <div>
                <label htmlFor="subheading" className="block text-sm font-medium text-slate-900 mb-2">
                  Subheading (Optional)
                </label>
                <textarea
                  id="subheading"
                  value={subheading}
                  onChange={(e) => setSubheading(e.target.value)}
                  placeholder="Add a descriptive subtitle"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !file}
                className="w-full px-4 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-4 bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 sm:px-6 py-4">
              <h2 className="text-base sm:text-lg font-bold text-white">Hero Mode</h2>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <p className="text-sm text-slate-600">
                Choose which hero section appears on the homepage.
              </p>

              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    value: 'dynamic' as HeroMode,
                    title: 'Dynamic',
                    description: 'Uses the current image carousel powered by hero uploads.',
                    icon: LayoutGrid,
                  },
                  {
                    value: 'static' as HeroMode,
                    title: 'Static',
                    description: 'Uses the premium front-view campus hero image.',
                    icon: Monitor,
                  },
                ].map((option) => {
                  const Icon = option.icon;
                  const isSelected = heroMode === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => void handleHeroModeChange(option.value)}
                      disabled={isSavingMode}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                        isSelected
                          ? 'border-yellow-400 bg-yellow-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <div className={`rounded-lg p-2 ${isSelected ? 'bg-yellow-100 text-slate-900' : 'bg-slate-100 text-slate-700'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-900">{option.title}</p>
                          {isSelected && (
                            <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-[11px] font-semibold text-slate-900">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{option.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {isSavingMode && (
                <p className="text-xs text-slate-500">Saving hero mode...</p>
              )}
            </div>
          </div>
        </div>

        {/* Hero Images Grid */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
              <h2 className="text-lg font-bold text-white">
                Hero Images ({heroImages.length})
              </h2>
            </div>

            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <ImageIcon className="h-4 w-4 text-slate-500" />
                <span>
                  Homepage is currently using the <strong>{heroMode === 'static' ? 'Static' : 'Dynamic'}</strong> hero.
                </span>
              </div>
            </div>

            {isLoadingImages ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-slate-400" />
                <p className="text-slate-600">Loading images...</p>
              </div>
            ) : heroImages.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-500 font-medium">No hero images yet.</p>
                <p className="text-slate-400 text-sm mt-1">Upload your first hero image to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6">
                {heroImages.map((image) => (
                  <div
                    key={image.id}
                    className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    {/* Image */}
                    <div className="relative h-40 bg-slate-100 overflow-hidden">
                      <Image
                        src={image.secure_url}
                        alt={image.heading || 'Hero image'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => handleDelete(image.public_id, image.id)}
                        disabled={isLoading}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-4">
                      {image.heading && (
                        <p className="font-semibold text-slate-900 text-sm mb-1">
                          {image.heading}
                        </p>
                      )}
                      {image.subheading && (
                        <p className="text-slate-600 text-xs mb-3 line-clamp-2">
                          {image.subheading}
                        </p>
                      )}
                      <div className="text-xs text-slate-500">
                        {image.width} × {image.height}px
                      </div>
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
