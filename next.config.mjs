import createNextIntlPlugin from 'next-intl/plugin'
import withPWA from 'next-pwa'

const withNextIntl = createNextIntlPlugin()
/** @type {import('next').NextConfig} */

const nextConfig = {
  ...withPWA({
    pwa: {
      dest: 'public',
      register: true,
      disable: process.env.NODE_ENV === 'development',
      skipWaiting: true,
    },
  }),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
