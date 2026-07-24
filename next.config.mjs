/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'],
    qualities: [58, 75],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
};

export default nextConfig;
