'use server';

import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, getDoc, getDocs, query, setDoc, where, serverTimestamp } from 'firebase/firestore';
import { requireAdminActionAccess, requireAdminSession } from '@/lib/admin-access';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export type HeroMode = 'dynamic' | 'static';

const HERO_SETTINGS_KIND = 'homepage_setting';
const HERO_SETTINGS_DOC_ID = 'homepage_setting';
const HERO_MODE_COOKIE = 'hero_mode_override';
const isDevelopment = process.env.NODE_ENV !== 'production';

function normalizeHeroMode(value: unknown): HeroMode {
  return value === 'static' ? 'static' : 'dynamic';
}

async function readHeroModeCookie(): Promise<HeroMode | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(HERO_MODE_COOKIE)?.value;

  if (value === 'static' || value === 'dynamic') {
    return value;
  }

  return null;
}

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
    await requireAdminActionAccess('uploadHeroImage', {
      limit: 8,
      windowMs: 60 * 1000,
    });

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
    await requireAdminActionAccess('deleteHeroImage', {
      limit: 20,
      windowMs: 60 * 1000,
    });

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
    if (isDevelopment) {
      return [];
    }

    await requireAdminSession();

    console.log('[getHeroImages] Fetching hero images from Firebase...');
    const q = query(collection(db, 'hero_images'));
    const querySnapshot = await getDocs(q);

    console.log('[getHeroImages] Found', querySnapshot.size, 'images in Firebase');

    const images = querySnapshot.docs
      .filter((doc) => doc.data().kind !== HERO_SETTINGS_KIND && !!doc.data().secure_url)
      .map((doc) => ({
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

export async function getHeroMode(): Promise<{
  success: boolean;
  data?: HeroMode;
  error?: string;
}> {
  try {
    if (isDevelopment) {
      const cookieMode = await readHeroModeCookie();

      return {
        success: true,
        data: cookieMode ?? 'dynamic',
      };
    }

    const fixedSetting = await getDoc(doc(db, 'hero_images', HERO_SETTINGS_DOC_ID));

    if (fixedSetting.exists() && fixedSetting.data().kind === HERO_SETTINGS_KIND) {
      return {
        success: true,
        data: normalizeHeroMode(fixedSetting.data().heroMode),
      };
    }

    const querySnapshot = await getDocs(query(collection(db, 'hero_images')));
    const latestLegacySetting = querySnapshot.docs
      .filter((heroDoc) => heroDoc.data().kind === HERO_SETTINGS_KIND)
      .sort((left, right) => {
        const leftTime = left.data().updated_at?.toMillis?.() ?? left.data().created_at?.toMillis?.() ?? 0;
        const rightTime = right.data().updated_at?.toMillis?.() ?? right.data().created_at?.toMillis?.() ?? 0;
        return rightTime - leftTime;
      })[0];

    if (!latestLegacySetting) {
      return { success: true, data: 'dynamic' };
    }

    return {
      success: true,
      data: normalizeHeroMode(latestLegacySetting.data().heroMode),
    };
  } catch (error) {
    console.error('[getHeroMode] Error fetching hero mode:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch hero mode',
    };
  }
}

export async function setHeroMode(mode: HeroMode): Promise<{
  success: boolean;
  data?: HeroMode;
  error?: string;
}> {
  try {
    await requireAdminActionAccess('setHeroMode', {
      limit: 20,
      windowMs: 60 * 1000,
    });

    const nextMode = normalizeHeroMode(mode);

    if (isDevelopment) {
      const cookieStore = await cookies();
      cookieStore.set(HERO_MODE_COOKIE, nextMode, {
        path: '/',
        sameSite: 'lax',
        httpOnly: false,
        secure: false,
        maxAge: 60 * 60 * 24 * 30,
      });

      revalidatePath('/');
      revalidatePath('/admin/manage-home');

      return {
        success: true,
        data: nextMode,
      };
    }

    await setDoc(doc(db, 'hero_images', HERO_SETTINGS_DOC_ID), {
      kind: HERO_SETTINGS_KIND,
      heroMode: nextMode,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    revalidatePath('/');

    return {
      success: true,
      data: nextMode,
    };
  } catch (error) {
    console.error('[setHeroMode] Error updating hero mode:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update hero mode',
    };
  }
}
