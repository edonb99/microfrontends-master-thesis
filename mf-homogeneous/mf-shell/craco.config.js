const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  webpack: {
    configure: (config) => {
      config.output.publicPath = "http://localhost:3000/";
      config.plugins.push(
        new ModuleFederationPlugin({
          name: "shell",
          remotes: {
            product_list: "product_list@http://localhost:3001/remoteEntry.js",
            product_detail: "product_detail@http://localhost:3002/remoteEntry.js",
            cart: "cart@http://localhost:3003/remoteEntry.js",
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
    port: 3000,
  },
  style: {
    postcssOptions: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
