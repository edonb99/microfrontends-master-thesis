const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  webpack: {
    configure: (config) => {
      config.output.publicPath = "http://localhost:3001/";
      config.plugins.push(
        new ModuleFederationPlugin({
          name: "product_list",
          filename: "remoteEntry.js",
          exposes: {
            "./ProductList": "./src/ProductList",
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
    port: 3001,
  },
  style: {
    postcssOptions: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
