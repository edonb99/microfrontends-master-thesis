const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  webpack: {
    configure: (config) => {
      config.output.publicPath = "http://localhost:3003/";
      config.plugins.push(
        new ModuleFederationPlugin({
          name: "cart",
          filename: "remoteEntry.js",
          exposes: {
            "./Cart": "./src/Cart",
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
    port: 3003,
  },
  style: {
    postcssOptions: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
