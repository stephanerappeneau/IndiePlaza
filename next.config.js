/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: './build',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
