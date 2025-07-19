const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: "development",
  devServer: {
    port: 4003,
  },
  webpack: {
    plugins: {
      add: [
        new ModuleFederationPlugin({
          name: "mfcart",
          filename: "remoteEntry.js",
          exposes: {
            "./Cart": "./src/Cart.jsx",
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
