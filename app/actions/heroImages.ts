'use server';

import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadHeroImage(
  formData: FormData
): Promise<{
  success: boolean;
  data?: { id: string; secure_url: string; public_id: string };
  error?: string;
}> {
  try {
    const file = formData.get('file') as File;
    const heading = formData.get('heading') as string;
    const subheading = formData.get('subheading') as string;

    if (!file) {
      console.error('[uploadHeroImage] No file provided');
      return { success: false, error: 'No file provided' };
    }

    // Server-side validation: File type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      console.error('[uploadHeroImage] Invalid file type:', file.type);
      return { success: false, error: 'Invalid file type. Only JPG, PNG, and WebP images are allowed.' };
    }

    // Server-side validation: File size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      console.error('[uploadHeroImage] File too large:', file.size, 'bytes');
      return {
        success: false,
        error: `File size must be less than 5MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
      };
    }

    console.log('[uploadHeroImage] Starting upload for file:', file.name, '(' + (file.size / 1024).toFixed(2) + 'KB)');

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using upload_stream
    return new Promise((resolve) => {
      console.log('[uploadHeroImage] Uploading to Cloudinary...');
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'jkd-hero-images',
          resource_type: 'auto',
          quality: 'auto',
        },
        async (error, result) => {
          if (error) {
            console.error('[uploadHeroImage] Cloudinary upload error:', error);
            resolve({
              success: false,
              error: 'Failed to upload to Cloudinary: ' + error.message,
            });
            return;
          }

          if (!result) {
            console.error('[uploadHeroImage] No result from Cloudinary');
            resolve({
              success: false,
              error: 'Failed to upload to Cloudinary: No response',
            });
            return;
          }

          console.log('[uploadHeroImage] Cloudinary upload successful:', {
            public_id: result.public_id,
            secure_url: result.secure_url,
          });

          try {
            console.log('[uploadHeroImage] Saving to Firebase...');
            // Save optimized document to Firebase Firestore
            const docRef = await addDoc(collection(db, 'hero_images'), {
              public_id: result.public_id,
              secure_url: result.secure_url,
              heading: heading || '',
              subheading: subheading || '',
              width: result.width,
              height: result.height,
              created_at: serverTimestamp(),
            });

            console.log('[uploadHeroImage] Firebase save successful, doc ID:', docRef.id);

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
              '[uploadHeroImage] Firebase save error:',
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
    console.error('[uploadHeroImage] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteHeroImage(
  publicId: string,
  docId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('[deleteHeroImage] Deleting image:', { publicId, docId });
    
    // Delete from Cloudinary
    console.log('[deleteHeroImage] Deleting from Cloudinary...');
    await cloudinary.uploader.destroy(publicId);
    console.log('[deleteHeroImage] Cloudinary deletion successful');

    // Delete from Firestore
    console.log('[deleteHeroImage] Deleting from Firebase...');
    await deleteDoc(doc(db, 'hero_images', docId));
    console.log('[deleteHeroImage] Firebase deletion successful');

    return { success: true };
  } catch (error) {
    console.error('[deleteHeroImage] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete image',
    };
  }
}

export async function getHeroImages(): Promise<
  Array<{
    id: string;
    public_id: string;
    secure_url: string;
    heading: string;
    subheading: string;
    width: number;
    height: number;
  }>
> {
  try {
    console.log('[getHeroImages] Fetching hero images from Firebase...');
    const q = query(collection(db, 'hero_images'));
    const querySnapshot = await getDocs(q);

    console.log('[getHeroImages] Found', querySnapshot.size, 'images in Firebase');

    const images = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      public_id: doc.data().public_id,
      secure_url: doc.data().secure_url,
      heading: doc.data().heading || '',
      subheading: doc.data().subheading || '',
      width: doc.data().width,
      height: doc.data().height,
    }));

    console.log('[getHeroImages] Successfully fetched and mapped images');
    return images;
  } catch (error) {
    console.error('[getHeroImages] Error fetching images:', error);
    return [];
  }
}
