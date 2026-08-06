'use server';

import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { requireAdminActionAccess } from '@/lib/admin-access';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadGalleryImage(
  formData: FormData
): Promise<{
  success: boolean;
  data?: { id: string; secure_url: string; public_id: string };
  error?: string;
}> {
  try {
    await requireAdminActionAccess('uploadGalleryImage', {
      limit: 10,
      windowMs: 60 * 1000,
    });

    const file = formData.get('file') as File;

    // Validation: File
    if (!file) {
      console.error('[uploadGalleryImage] No file provided');
      return { success: false, error: 'No file provided' };
    }

    // Server-side validation: File type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.error('[uploadGalleryImage] Invalid file type:', file.type);
      return { success: false, error: 'Invalid file type. Only JPG, PNG, and WebP images are allowed.' };
    }

    // Server-side validation: File size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      console.error('[uploadGalleryImage] File too large:', file.size, 'bytes');
      return {
        success: false,
        error: `File size must be less than 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
      };
    }

    console.log('[uploadGalleryImage] Starting upload for file:', file.name, '(' + (file.size / 1024).toFixed(2) + 'KB)');

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using upload_stream
    return new Promise((resolve) => {
      console.log('[uploadGalleryImage] Uploading to Cloudinary...');
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'jkd-gallery',
          resource_type: 'auto',
          quality: 'auto',
        },
        async (error, result) => {
          if (error) {
            console.error('[uploadGalleryImage] Cloudinary upload error:', error);
            resolve({
              success: false,
              error: 'Failed to upload to Cloudinary: ' + error.message,
            });
            return;
          }

          if (!result) {
            console.error('[uploadGalleryImage] No result from Cloudinary');
            resolve({
              success: false,
              error: 'Failed to upload to Cloudinary: No response',
            });
            return;
          }

          console.log('[uploadGalleryImage] Cloudinary upload successful:', {
            public_id: result.public_id,
            secure_url: result.secure_url,
          });

          // Wrap Firestore save in try...catch as per requirements
          try {
            console.log('[uploadGalleryImage] Saving to Firebase Firestore...');
            // Save to Firebase Firestore with explicit collection ID "gallery_images"
            // PHASE 1: Include default isFeatured: false
            const docRef = await addDoc(collection(db, 'gallery_images'), {
              secure_url: result.secure_url,
              public_id: result.public_id,
              created_at: serverTimestamp(),
              isFeatured: false, // Default to not featured
            });

            console.log('[uploadGalleryImage] Firebase save successful, doc ID:', docRef.id);

            resolve({
              success: true,
              data: {
                id: docRef.id,
                secure_url: result.secure_url,
                public_id: result.public_id,
              },
            });
          } catch (firestoreError) {
            console.error(
              '[uploadGalleryImage] Firebase save error:',
              firestoreError instanceof Error
                ? firestoreError.message
                : 'Unknown Firestore error',
              'Full error:',
              firestoreError
            );
            resolve({
              success: false,
              error:
                'Failed to save to database: ' +
                (firestoreError instanceof Error
                  ? firestoreError.message
                  : 'Unknown error'),
            });
          }
        }
      );

      stream.end(buffer);
    });
  } catch (error) {
    console.error('[uploadGalleryImage] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
