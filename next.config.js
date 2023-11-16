/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // This will overwrite the default option for `.node`

    if (!isServer) {
      // Replace MongoDB module with a dummy module on client-side
      config.resolve.alias['mongodb'] = false;
    }

    // Important: return the modified config
    return config;
  },

  images: {
    domains: [
      'avatars.githubusercontent.com',
      'avatar.vercel.sh',
      'avatar-management--avatars.us-west-2.prod.public.atl-paas.net',
      'api.atlassian.com',
      'tangential.eu.ngrok.io',
      'dev.tangential.app',
      'live.tangential.app',
    ]
  }
};

module.exports = nextConfig;
