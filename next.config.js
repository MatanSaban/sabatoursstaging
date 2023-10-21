/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    GOOGLE_MAPS_API_KEY: "AIzaSyDqXMWSWoY417DNKERQid8teEuoxBjMLLo",
    DATA_SOURCE: "https://saban-tours.ussl.co.il/wp-json/wp/v2",
    WORDPRESSTOKEN: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJzYWJhbnRvdV9hZG1pbiIsImlhdCI6MTY5Nzg5ODY2MiwiZXhwIjoxODU1NTc4NjYyfQ.oCkMkngRArnT1BwRs6bExWcQ-jsDncZla0SmHMIu588",
    SUMIT_COMPANYID: 283489399,
    SUMIT_APIKEY: "DewD8H4e3DCDlv15P7tCyp8tf2LZe9c07IFfiAc0GlfYadNDVK",
    SUMIT_CHARGE_ENDPOINT: "https://api.sumit.co.il/billing/payments/charge/"
  },
  images: {
    domains: ["saban-tours.ussl.co.il"],
  },
};

module.exports = nextConfig;
 