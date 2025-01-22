/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      API_URL: process.env.API_URL, // This will make it available in both server-side and client-side
    },
  };
  
  export default nextConfig;
  