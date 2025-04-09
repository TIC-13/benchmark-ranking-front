/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/llmRanking', 
          permanent: true,
        },
      ];
    },
  };
  
  export default nextConfig;