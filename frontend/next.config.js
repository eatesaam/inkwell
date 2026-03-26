/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.preview.myndlab.ai', '*.hotload.myndlab.ai'],
  images: { unoptimized: true },
};
module.exports = nextConfig;