/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compress: true,
  // devIndicators: {
  //   buildActivity: false,
  // },
  env: {
    GOOGLE_MAPS_API_KEY: "AIzaSyA6Mm8uJAQNkzntDk0gQ6zt0tIom8zZAlQ",
    DATA_SOURCE: "https://saban-tours.ussl.co.il/wp-json/wp/v2",
    WORDPRESSTOKEN:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsIm5hbWUiOiJTdXBlckFkbWluU2FiYW4iLCJpYXQiOjE2OTg5NjY3MzAsImV4cCI6MTg1NjY0NjczMH0.JK2T-hU0Ij3DgNuXSG9zxWRlntMfxfUiy2f1fXk5ryo",
    SUMIT_COMPANYID: "283489399",
    SUMIT_APIKEY: "DewD8H4e3DCDlv15P7tCyp8tf2LZe9c07IFfiAc0GlfYadNDVK",
    SUMIT_CHARGE_ENDPOINT: "https://api.sumit.co.il/billing/payments/charge/",
    GOOGLE_TAG_MANAGER_ID: "G-4WWJ8F67H9",
    SITE_URL: "https://saban-tours.co.il",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "saban-tours.ussl.co.il",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
