import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // Using cloud_name as api_key for public uploads
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// For unsigned uploads (direct from frontend)
export const getCloudinarySignature = async (timestamp: number) => {
  const signature = await fetch('/api/cloudinary-signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timestamp }),
  }).then((res) => res.json());
  return signature;
};
