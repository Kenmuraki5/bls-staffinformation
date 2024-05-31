/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8081'
    },
    async redirects() {
        return [
          {
            source: "/",
            destination: "/BLS",
            permanent: true,
          },
        ];
      },
};

export default nextConfig;
