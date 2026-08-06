'use server';

import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, query, getDocs, serverTimestamp } from 'firebase/firestore';
import { requireAdminActionAccess, requireAdminSession } from '@/lib/admin-access';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadTopper(
  formData: FormData
): Promise<{
  success: boolean;
  data?: { id: string; secure_url: string; public_id: string };
  error?: string;
}> {
  try {
    await requireAdminActionAccess('uploadTopper', {
      limit: 8,
      windowMs: 60 * 1000,
    });

    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const classStream = formData.get('classStream') as string;
    const score = formData.get('score') as string;
    const passingYear = formData.get('passingYear') as string;

    // Validation: File
    if (!file) {
      console.error('[uploadTopper] No file provided');
      return { success: false, error: 'No file provided' };
    }

    // Server-side validation: File type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.error('[uploadTopper] Invalid file type:', file.type);
      return { success: false, error: 'Invalid file type. Only JPG, PNG, and WebP images are allowed.' };
    }

    // Server-side validation: File size (2MB limit for toppers)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      console.error('[uploadTopper] File too large:', file.size, 'bytes');
      return {
        success: false,
        error: `File size must be less than 2MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
      };
    }

    // Validation: Required fields
    if (!name || !name.trim()) {
      return { success: false, error: 'Student name is required' };
    }

    if (!classStream || !classStream.trim()) {
      return { success: false, error: 'Class/Stream is required' };
    }

    if (!score || isNaN(parseFloat(score)) || parseFloat(score) < 0 || parseFloat(score) > 100) {
      return { success: false, error: 'Score must be a valid number between 0 and 100' };
    }

    if (!passingYear || isNaN(parseInt(passingYear)) || parseInt(passingYear) < 1900 || parseInt(passingYear) > new Date().getFullYear() + 1) {
      return { success: false, error: 'Passing year must be a valid year' };
    }

    console.log('[uploadTopper] Starting upload for file:', file.name, '(' + (file.size / 1024).toFixed(2) + 'KB)');

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using upload_stream
    return new Promise((resolve) => {
      console.log('[uploadTopper] Uploading to Cloudinary...');
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'jkd-toppers',
          resource_type: 'auto',
          quality: 'auto',
        },
        async (error, result) => {
          if (error) {
            console.error('[uploadTopper] Cloudinary upload error:', error);
            resolve({
              success: false,
              error: 'Failed to upload to Cloudinary: ' + error.message,
            });
            return;
          }

          if (!result) {
            console.error('[uploadTopper] No result from Cloudinary');
            resolve({
              success: false,
              error: 'Failed to upload to Cloudinary: No response',
            });
            return;
          }

          console.log('[uploadTopper] Cloudinary upload successful:', {
            public_id: result.public_id,
            secure_url: result.secure_url,
          });

          try {
            console.log('[uploadTopper] Saving to Firebase...');
            // Save optimized document to Firebase Firestore
            const docRef = await addDoc(collection(db, 'toppers'), {
              name: name.trim(),
              classStream: classStream.trim(),
              score: parseFloat(score),
              passingYear: parseInt(passingYear),
              secure_url: result.secure_url,
              public_id: result.public_id,
              created_at: serverTimestamp(),
            });

            console.log('[uploadTopper] Firebase save successful, doc ID:', docRef.id);

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
              '[uploadTopper] Firebase save error:',
              firestoreError instanceof Error ? firestoreError.message : 'Unknown error'
            );
            resolve({
              success: false,
              error:
                'Failed to save to database: ' +
                (firestoreError instanceof Error ? firestoreError.message : 'Unknown error'),
            });
          }
        }
      );

      stream.end(buffer);
    });
  } catch (error) {
    console.error('[uploadTopper] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteTopper(
  publicId: string,
  docId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminActionAccess('deleteTopper', {
      limit: 20,
      windowMs: 60 * 1000,
    });

    console.log('[deleteTopper] Deleting topper:', { publicId, docId });

    // Delete from Cloudinary
    console.log('[deleteTopper] Deleting from Cloudinary...');
    await cloudinary.uploader.destroy(publicId);
    console.log('[deleteTopper] Cloudinary deletion successful');

    // Delete from Firestore
    console.log('[deleteTopper] Deleting from Firebase...');
    await deleteDoc(doc(db, 'toppers', docId));
    console.log('[deleteTopper] Firebase deletion successful');

    return { success: true };
  } catch (error) {
    console.error('[deleteTopper] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete topper',
    };
  }
}

export async function getToppers(): Promise<
  Array<{
    id: string;
    name: string;
    classStream: string;
    score: number;
    passingYear: number;
    secure_url: string;
    public_id: string;
  }>
> {
  try {
    await requireAdminSession();

    console.log('[getToppers] Fetching toppers from Firebase...');
    const q = query(collection(db, 'toppers'));
    const querySnapshot = await getDocs(q);

    console.log('[getToppers] Found', querySnapshot.size, 'toppers in Firebase');

    const toppers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      classStream: doc.data().classStream,
      score: doc.data().score,
      passingYear: doc.data().passingYear,
      secure_url: doc.data().secure_url,
      public_id: doc.data().public_id,
    }));

    console.log('[getToppers] Successfully fetched and mapped toppers');
    return toppers;
  } catch (error) {
    console.error('[getToppers] Error fetching toppers:', error);
    return [];
  }
}
