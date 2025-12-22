/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend:8000/api/:path*",
      },
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
