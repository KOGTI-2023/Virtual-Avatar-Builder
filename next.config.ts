import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow builds to proceed even if ESLint is not available in the environment.
    ignoreDuringBuilds: true,
        typescript: {
      ignoreBuildErrors: true,
    },
  },
  webpack: (config) => {
    if (process.env.NODE_ENV === "development") {
      config.module.rules.push({
        test: /\.(jsx|tsx)$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: "@dyad-sh/nextjs-webpack-component-tagger",
      });
    }
    return config;
  },
  async rewrites() {
    const rewrites = [];

    const externalApiUrlService1 = process.env.EXTERNAL_API_URL_SERVICE1;
    const externalApiUrlService2 = process.env.EXTERNAL_API_URL_SERVICE2;
    const weatherApiUrl = process.env.WEATHER_API_URL;
    const externalSttApiUrl = process.env.EXTERNAL_STT_API_URL; // New STT API URL

    if (externalApiUrlService1) {
      rewrites.push({
        source: '/api/service1/:path*',
        destination: `${externalApiUrlService1}/:path*`,
      });
    }

    if (externalApiUrlService2) {
      rewrites.push({
        source: '/api/service2/:path*',
        destination: `${externalApiUrlService2}/:path*`,
      });
    }

    if (weatherApiUrl) {
      rewrites.push({
        source: '/api/weather/:path*',
        destination: `${weatherApiUrl}/:path*`,
      });
    }

    if (externalSttApiUrl) {
      rewrites.push({
        source: '/api/stt/:path*',
        destination: `${externalSttApiUrl}/:path*`,
      });
    }

    return rewrites;
  },
};

export default nextConfig;
