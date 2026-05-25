'use client';

import { useState, useEffect } from 'react';
import { uploadTopper, deleteTopper, getToppers } from '@/app/actions/uploadTopper';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Topper {
  id: string;
  name: string;
  classStream: string;
  score: number;
  passingYear: number;
  secure_url: string;
  public_id: string;
}

const classStreamOptions = [
  { value: '10th', label: '10th' },
  { value: '12th Science', label: '12th Science' },
  { value: '12th Commerce', label: '12th Commerce' },
  { value: '12th Arts', label: '12th Arts' },
];

export default function ManageToppersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [classStream, setClassStream] = useState('');
  const [score, setScore] = useState('');
  const [passingYear, setPassingYear] = useState(new Date().getFullYear().toString());
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingToppers, setIsLoadingToppers] = useState(true);
  const [toppers, setToppers] = useState<Topper[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch toppers on mount
  useEffect(() => {
    fetchToppers();
  }, []);

  const fetchToppers = async () => {
    try {
      setIsLoadingToppers(true);
      console.log('[fetchToppers] Fetching toppers from Firebase...');
      const data = await getToppers();
      console.log('[fetchToppers] Received', data.length, 'toppers from Firebase');
      setToppers(data);
    } catch (err) {
      console.error('[fetchToppers] Error fetching toppers:', err);
      setError('Failed to load toppers');
    } finally {
      setIsLoadingToppers(false);
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

      // Validate file size (2MB limit for toppers)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (selectedFile.size > maxSize) {
        setError('File size must be less than 2MB. Your file is ' + (selectedFile.size / (1024 * 1024)).toFixed(2) + 'MB.');
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

    // Validation
    if (!file) {
      setError('Please select an image file');
      return;
    }

    if (!name.trim()) {
      setError('Student name is required');
      return;
    }

    if (!classStream) {
      setError('Please select a class/stream');
      return;
    }

    if (!score || isNaN(parseFloat(score)) || parseFloat(score) < 0 || parseFloat(score) > 100) {
      setError('Score must be a valid number between 0 and 100');
      return;
    }

    if (!passingYear || isNaN(parseInt(passingYear))) {
      setError('Passing year is required');
      return;
    }

    // Validate file one more time
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setError('File size must be less than 2MB. Your file is ' + (file.size / (1024 * 1024)).toFixed(2) + 'MB.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Only JPG, PNG, and WebP images are allowed.');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('classStream', classStream);
      formData.append('score', score);
      formData.append('passingYear', passingYear);

      console.log('[handleSubmit] Calling uploadTopper...');
      const result = await uploadTopper(formData);

      if (result.success) {
        console.log('[handleSubmit] Upload successful:', result.data);
        setSuccess('Topper added successfully!');

        // Clear form
        setFile(null);
        setName('');
        setClassStream('');
        setScore('');
        setPassingYear(new Date().getFullYear().toString());
        setPreviewUrl(null);

        // Reset file input
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (input) input.value = '';

        // Re-fetch toppers from Firebase
        console.log('[handleSubmit] Re-fetching toppers from Firebase...');
        await fetchToppers();
        console.log('[handleSubmit] Toppers re-fetched successfully');
      } else {
        console.error('[handleSubmit] Upload failed:', result.error);
        setError(result.error || 'Failed to add topper. Please try again.');
      }
    } catch (err) {
      console.error('[handleSubmit] Unexpected error during upload:', err);

      if (err instanceof Error) {
        if (err.message.includes('network') || err.message.includes('fetch')) {
          setError('Network error. Please check your connection and try again.');
        } else if (err.message.includes('timeout')) {
          setError('Upload timed out. Please try again.');
        } else {
          setError('Error uploading: ' + err.message);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
      console.log('[handleSubmit] Upload process completed, loading state reset');
    }
  };

  const handleDelete = async (publicId: string, docId: string) => {
    if (!confirm('Are you sure you want to delete this topper?')) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('[handleDelete] Deleting topper:', { publicId, docId });
      const result = await deleteTopper(publicId, docId);

      if (result.success) {
        console.log('[handleDelete] Deletion successful');
        setSuccess('Topper deleted successfully!');
        console.log('[handleDelete] Re-fetching toppers from Firebase...');
        await fetchToppers();
        console.log('[handleDelete] Toppers re-fetched successfully');
      } else {
        console.error('[handleDelete] Deletion failed:', result.error);
        setError(result.error || 'Failed to delete topper');
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
          Manage Toppers
        </h1>
        <p className="text-sm sm:text-base text-slate-600">Add and manage student toppers for your institution.</p>
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
              <h2 className="text-base sm:text-lg font-bold text-white">Add New Topper</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              {/* File Input */}
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-slate-900 mb-2">
                  Photo (Max 2MB)
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

              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-2">
                  Student Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Raj Kumar"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Class/Stream Select */}
              <div>
                <label htmlFor="classStream" className="block text-sm font-medium text-slate-900 mb-2">
                  Class/Stream *
                </label>
                <select
                  id="classStream"
                  value={classStream}
                  onChange={(e) => setClassStream(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select Class/Stream</option>
                  {classStreamOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Score Input */}
              <div>
                <label htmlFor="score" className="block text-sm font-medium text-slate-900 mb-2">
                  Score/Percentage *
                </label>
                <input
                  type="number"
                  id="score"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="e.g., 95.5"
                  step="0.1"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Passing Year Input */}
              <div>
                <label htmlFor="passingYear" className="block text-sm font-medium text-slate-900 mb-2">
                  Passing Year *
                </label>
                <input
                  type="number"
                  id="passingYear"
                  value={passingYear}
                  onChange={(e) => setPassingYear(e.target.value)}
                  min="1900"
                  max={new Date().getFullYear() + 1}
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
                    Adding...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Add Topper
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Toppers Table */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
              <h2 className="text-lg font-bold text-white">
                Toppers ({toppers.length})
              </h2>
            </div>

            {isLoadingToppers ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-slate-400" />
                <p className="text-slate-600">Loading toppers...</p>
              </div>
            ) : toppers.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-500 font-medium">No toppers yet.</p>
                <p className="text-slate-400 text-sm mt-1">Add your first topper using the form on the left.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900">Photo</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900">Name</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900">Class</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900">Score</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900">Year</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-slate-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {toppers.map((topper) => (
                      <tr key={topper.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100">
                            <Image
                              src={topper.secure_url}
                              alt={topper.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-slate-900 font-medium">{topper.name}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">{topper.classStream}</td>
                        <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-yellow-600">{topper.score}%</td>
                        <td className="px-4 sm:px-6 py-4 text-sm text-slate-600">{topper.passingYear}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <button
                            onClick={() => handleDelete(topper.public_id, topper.id)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                            title="Delete topper"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
