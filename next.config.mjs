/** @type {import('next').NextConfig} */
const nextConfig = {
  // The original site serves its /images/* assets untouched — keep that behaviour so
  // paths stay identical and no image CDN round-trip is needed.
  images: { unoptimized: true },
};

export default nextConfig;
