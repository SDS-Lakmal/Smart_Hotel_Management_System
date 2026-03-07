/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// Add a rewrite rule so any requests to /api/* during dev are proxied to the backend
// This avoids CORS issues when developing locally.
nextConfig.rewrites = async () => {
  return [
    {
      source: '/api/:path*',
      // backend controller is mapped under /api/* (see InventoryController -> @RequestMapping("/api/inventory"))
      // so include the /api prefix when proxying
      destination: 'http://localhost:8080/api/:path*',
    },
  ];
};

module.exports = nextConfig;
