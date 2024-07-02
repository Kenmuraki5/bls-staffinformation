/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8081'
    },
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: '10.5.0.173',
          pathname: '**',
        },
      ],
    },
    async redirects() {
        return [
          {
            source: "/",
            destination: "/bualuang/BLS",
            permanent: true,
          },
        ];
      },
};

export default nextConfig;
