/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_NAME: 'Mei-Kaappan',
    NEXT_PUBLIC_APP_SUBTITLE: 'Intelligent Scam Prevention & Protection System',
    NEXT_PUBLIC_APP_VERSION: '1.0.0-prototype',
    NEXT_PUBLIC_DEMO_MODE: 'true',
  },
};

module.exports = nextConfig;
