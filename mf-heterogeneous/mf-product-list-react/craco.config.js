const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: "development",
  devServer: {
    port: 4001,
  },
  webpack: {
    plugins: {
      add: [
        new ModuleFederationPlugin({
          name: "mfproductlist",
          filename: "remoteEntry.js",
          exposes: {
            "./ProductList": "./src/ProductList.jsx",
          },
          shared: {
            react: { singleton: true },
            "react-dom": { singleton: true },
            "react-router-dom": { singleton: true },
          },
        }),
      ]
    }
  },
};
