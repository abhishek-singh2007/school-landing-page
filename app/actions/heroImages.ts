'use server';

import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';

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
      return { success: false, error: 'No file provided' };
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary using upload_stream
    return new Promise((resolve) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'jkd-hero-images',
          resource_type: 'auto',
          quality: 'auto',
        },
        async (error, result) => {
          if (error || !result) {
            resolve({
              success: false,
              error: 'Failed to upload to Cloudinary',
            });
            return;
          }

          try {
            // Save to Firebase Firestore
            const docRef = await addDoc(collection(db, 'hero_images'), {
              public_id: result.public_id,
              secure_url: result.secure_url,
              cloudinary_url: result.secure_url,
              heading: heading || '',
              subheading: subheading || '',
              width: result.width,
              height: result.height,
              created_at: new Date(),
              updated_at: new Date(),
            });

            resolve({
              success: true,
              data: {
                id: docRef.id,
                secure_url: result.secure_url,
                public_id: result.public_id,
              },
            });
          } catch (firestoreError) {
            resolve({
              success: false,
              error: 'Failed to save to database',
            });
          }
        }
      );

      stream.end(buffer);
    });
  } catch (error) {
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
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Delete from Firestore
    await deleteDoc(doc(db, 'hero_images', docId));

    return { success: true };
  } catch (error) {
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
    const q = query(collection(db, 'hero_images'));
    const querySnapshot = await getDocs(q);

    const images = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      public_id: doc.data().public_id,
      secure_url: doc.data().secure_url,
      heading: doc.data().heading || '',
      subheading: doc.data().subheading || '',
      width: doc.data().width,
      height: doc.data().height,
    }));

    return images;
  } catch (error) {
    console.error('Error fetching hero images:', error);
    return [];
  }
}
