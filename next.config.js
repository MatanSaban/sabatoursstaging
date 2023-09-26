/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    GOOGLE_MAPS_API_KEY: "AIzaSyDqXMWSWoY417DNKERQid8teEuoxBjMLLo",
    DATA_SOURCE: "https://saban-tours.ussl.co.il/wp-json/wp/v2",
  },
};

module.exports = nextConfig;
