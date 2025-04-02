const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/** @type {import('next').NextConfig} */
const userConfig = {
  webpack: (config, { isServer }) => {
    // Solo aplicar en el lado del cliente
    if (!isServer) {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: "static/css/[contenthash].css",
          chunkFilename: "static/css/[contenthash].css",
        })
      );
    }

    return config;
  },
};

module.exports = userConfig;
