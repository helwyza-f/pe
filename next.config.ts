import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  allowedDevOrigins: [
    "minibos.bookinaja.com:3000",
    "*.bookinaja.com:3000",
    "localhost:3000",
  ],
};

export default nextConfig;
