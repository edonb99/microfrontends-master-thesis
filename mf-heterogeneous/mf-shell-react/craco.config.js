const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  mode: "development",
  devServer: {
    port: 4000,
  },
  webpack: {
    plugins: {
      add: [
        new ModuleFederationPlugin({
          name: "shell",
          remotes: {
            mfproductlist: "mfproductlist@http://localhost:4001/remoteEntry.js",
            mfproductdetail: "mfproductdetail@http://localhost:4002/remoteEntry.js", 
            mfcart: "mfcart@http://localhost:4003/remoteEntry.js",
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
