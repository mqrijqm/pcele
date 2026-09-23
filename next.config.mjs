/** @type {import('next').NextConfig} */
const nextConfig = {
  // Landing photographs are already compressed WebP files and are preloaded
  // under these exact URLs, so Image must reuse that browser cache directly.
  images: { unoptimized: true },
};

export default nextConfig;
