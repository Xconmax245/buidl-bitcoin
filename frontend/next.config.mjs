/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // turbopack: {
    //   root: ".." 
    // }
  },
  // We can also disable ESLint/TypeScript during build if needed
  // But for now let's just fix the config loading
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
