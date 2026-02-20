/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack for production builds if it's being forced
  // In some experimental versions, this can be done via experimental flags
  experimental: {
    turbo: {
      // items here
    },
  },
  // Ensure we are using the standard build pipeline
  reactStrictMode: true,
  // Fix the 'eslint' warning by using the correct structure if it changed, 
  // or just keeping it if it's a version quirk.
  // Actually, let's try to remove them to see if it builds without them.
};

export default nextConfig;
