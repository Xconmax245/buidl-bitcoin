/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Enable WebAssembly support for crypto libraries (tiny-secp256k1, etc.)
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Handle node: protocol imports and Buffer polyfills for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
      };
    }

    return config;
  },
};

export default nextConfig;
