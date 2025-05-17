/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/fonts/:path*",
        destination: "/fonts/:path*",
      },
    ];
  },
};

export default nextConfig;
