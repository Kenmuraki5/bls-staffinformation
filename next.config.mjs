/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8081'
    },
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: '*',
          pathname: '**',
        },
        {
          protocol: 'https',
          hostname: 'https://bualuangstaffinfo.sawasdee.brk1',
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
