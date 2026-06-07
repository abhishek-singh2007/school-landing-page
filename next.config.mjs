/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "embla-carousel-react"],
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
