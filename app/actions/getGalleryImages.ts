'use server';

import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export interface GalleryImage {
  id: string;
  secure_url: string;
  public_id: string;
  isFeatured?: boolean;
  created_at: unknown;
}

export async function getGalleryImages(): Promise<{
  success: boolean;
  data?: GalleryImage[];
  error?: string;
}> {
  try {
    console.log('[getGalleryImages] Fetching all gallery images from Firestore...');
    
    // PHASE 3: Query ALL images sorted by created_at descending (do not filter by isFeatured)
    const q = query(
      collection(db, 'gallery_images'),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    console.log('[getGalleryImages] Found', querySnapshot.size, 'images in Firestore');
    
    const images: GalleryImage[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      secure_url: doc.data().secure_url,
      public_id: doc.data().public_id,
      isFeatured: doc.data().isFeatured,
      created_at: doc.data().created_at,
    }));
    
    return {
      success: true,
      data: images,
    };
  } catch (error) {
    console.error('[getGalleryImages] Error fetching images:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch gallery images',
    };
  }
}
