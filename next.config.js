/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.ignoreWarnings = [
      { module: /onnxruntime-web/ },
      { module: /docx/ },
    ];
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    if (isServer) {
      config.externals = [...config.externals, /^pdfjs-dist/, /^docx/];
    } else {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
