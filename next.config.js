/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["recommends.stonegate.me"],
  },
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/stonega/recommends",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
