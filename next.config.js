/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  images: {
    domains: [
      "recommends.stonegate.me",
      "avatars.dicebear.com",
      "avatars.githubusercontent.com ",
    ],
  },
  async redirects() {
    return [
      {
        source: "/github",
        destination: "https://github.com/stonega/recos",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
