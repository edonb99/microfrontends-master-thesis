const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  webpack: {
    configure: (config) => {
      config.output.publicPath = "http://localhost:3002/";
      config.plugins.push(
        new ModuleFederationPlugin({
          name: "product_detail",
          filename: "remoteEntry.js",
          exposes: {
            "./ProductDetail": "./src/ProductDetail",
          },
          shared: {
            react: { singleton: true },
            "react-dom": { singleton: true },
            "react-router-dom": { singleton: true },
          },
        })
      );
      return config;
    },
  },
  devServer: {
    port: 3002,
  },
  style: {
    postcssOptions: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
