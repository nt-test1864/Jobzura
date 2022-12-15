/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ["easylaunchnftdospace1.fra1.digitaloceanspaces.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/find-talent/jobs",
        permanent: true,
      },
    ];
  }
}

module.exports = nextConfig
