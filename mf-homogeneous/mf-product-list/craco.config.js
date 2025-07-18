const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  webpack: {
    configure: (config) => {
      config.plugins.push(
        new ModuleFederationPlugin({
          name: "product_list",
          filename: "remoteEntry.js",
          exposes: {
            "./ProductList": "./src/ProductList",
          },
          shared: {
            react: { singleton: true, eager: true, requiredVersion: "^18.0.0" },
            "react-dom": { singleton: true, eager: true, requiredVersion: "^18.0.0" },
          },
        })
      );
      return config;
    },
  },
  style: {
    postcssOptions: {
      plugins: [
        require("tailwindcss"),
        require("autoprefixer"),
      ],
    },
  },
};
