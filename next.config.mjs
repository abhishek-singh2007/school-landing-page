/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "embla-carousel-react"],
  },
};

export default nextConfig;
