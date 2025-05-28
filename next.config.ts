import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable React Strict Mode to prevent double-rendering in development
  reactStrictMode: false,
   images: {
    domains: ['ui-avatars.com'], // Add this line
    // You can also use remotePatterns for more control:
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
    ],
  },
     
     typescript: {
       ignoreBuildErrors: true,
     },
     eslint: {
      ignoreDuringBuilds: true,
     }
   ,
  // Enable incremental static regeneration for better performance
  experimental: {
    ppr: 'incremental',
    // Additional optimizations
    optimizeServerReact: true,
    disableOptimizedLoading: false,
  },
  
  // Add logging to help debug duplicate requests
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
  // Configure HTTP keep-alive to reuse connections
  httpAgentOptions: {
    keepAlive: true,
  },
};

export default nextConfig;