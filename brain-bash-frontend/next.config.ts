import type { NextConfig } from "next";

// To allow this host in development, add it to "allowedDevOrigins" in next.config.js and restart the dev server:      

// // next.config.js
// module.exports = {
//   allowedDevOrigins: ['192.168.18.11'],
// }



const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.18.11'],
};

export default nextConfig;
