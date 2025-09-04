/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // standalone 모드 추가
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img2.joongna.com",
        port: "",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "dev.macacolabs.site",
        port: "8008",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

export default nextConfig;
