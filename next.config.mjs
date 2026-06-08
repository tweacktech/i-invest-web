// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   output: 'standalone',
// };

// export default nextConfig;

import withPWA from 'next-pwa';

const nextConfig = {
  outputFileTracingRoot: process.cwd(),
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,

  fallbacks: {
    document: '/offline.html',
  },
})(nextConfig);