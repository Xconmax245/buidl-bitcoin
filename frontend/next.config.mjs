/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* 
     Explicitly avoiding any experimental keys that might 
     trigger the experimental Turbopack build engine.
  */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
