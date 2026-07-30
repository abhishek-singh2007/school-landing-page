'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { requireAdminActionAccess } from '@/lib/admin-access';

export async function toggleFeaturedImage(
  docId: string,
  currentStatus: boolean
): Promise<{
  success: boolean;
  isFeatured?: boolean;
  error?: string;
}> {
  try {
    await requireAdminActionAccess('toggleFeaturedImage', {
      limit: 20,
      windowMs: 60 * 1000,
    });

    console.log('[toggleFeaturedImage] Toggling featured status for doc:', docId, 'current:', currentStatus);
    
    const docRef = doc(db, 'gallery_images', docId);
    const newStatus = !currentStatus;
    
    await updateDoc(docRef, {
      isFeatured: newStatus,
    });
    
    console.log('[toggleFeaturedImage] Successfully toggled to:', newStatus);
    
    return {
      success: true,
      isFeatured: newStatus,
    };
  } catch (error) {
    console.error('[toggleFeaturedImage] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to toggle featured status',
    };
  }
}

export async function getFeaturedImages(): Promise<{
  success: boolean;
  data?: Array<{
    id: string;
    secure_url: string;
    public_id: string;
    isFeatured: boolean;
    created_at: string | null;
  }>;
  error?: string;
}> {
  try {
    console.log('[getFeaturedImages] Fetching featured images from Firestore...');
    
    // Query featured images, limit to 4, sorted by created_at descending
    const q = query(
      collection(db, 'gallery_images'),
      where('isFeatured', '==', true),
      orderBy('created_at', 'desc'),
      limit(4)
    );
    
    const querySnapshot = await getDocs(q);
    
    console.log('[getFeaturedImages] Found', querySnapshot.size, 'featured images');
    
    const images = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        secure_url: data.secure_url,
        public_id: data.public_id,
        isFeatured: data.isFeatured,
        // Convert Firebase Timestamp to ISO string for proper serialization
        created_at: data.created_at ? new Date(data.created_at.toMillis()).toISOString() : null,
      };
    });
    
    return {
      success: true,
      data: images,
    };
  } catch (error) {
    console.error('[getFeaturedImages] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch featured images',
    };
  }
}
