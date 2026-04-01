/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    BEEHIIV_API_KEY: process.env.BEEHIIV_API_KEY,
    BEEHIIV_PUB_ID: process.env.BEEHIIV_PUB_ID,
  },
}

module.exports = nextConfig
