import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Disable React Strict Mode to prevent double-rendering in development
  reactStrictMode: false,
  
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