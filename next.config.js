/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    GOOGLE_MAPS_API_KEY: 'AIzaSyDqXMWSWoY417DNKERQid8teEuoxBjMLLo', // Replace with your actual API key
  },
};

module.exports = nextConfig;
