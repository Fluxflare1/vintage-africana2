/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Proxy API calls from the browser -> backend (Docker service name)
      {
        source: "/api/:path*",
        destination: "http://backend:8000/api/:path*",
      },
      // Media/static if needed
      {
        source: "/media/:path*",
        destination: "http://backend:8000/media/:path*",
      },
      {
        source: "/static/:path*",
        destination: "http://backend:8000/static/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
