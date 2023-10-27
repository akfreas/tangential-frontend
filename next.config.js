/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'avatar.vercel.sh',
      'avatar-management--avatars.us-west-2.prod.public.atl-paas.net',
      'api.atlassian.com',
      'tangential.eu.ngrok.io',
      'dev.tangential.app'
    ]
  },
};

module.exports = nextConfig;
