const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  webpack: {
    configure: (config) => {
      config.output.publicPath = "http://localhost:4000/";
      config.plugins.push(
        new ModuleFederationPlugin({
          name: "shell",
          remotes: {
            product_list: "product_list@http://localhost:4001/remoteEntry.js",
            product_detail: "product_detail@http://localhost:4002/remoteEntry.js",
            cart: "cart@http://localhost:4003/remoteEntry.js",
          },
          shared: {
            react: { 
              singleton: true, 
              requiredVersion: false,
              eager: false
            },
            "react-dom": { 
              singleton: true, 
              requiredVersion: false,
              eager: false
            },
            "react-router-dom": { 
              singleton: true, 
              requiredVersion: false,
              eager: false
            },
          },
        })
      );
      return config;
    },
  },
  devServer: {
    port: 4000,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  style: {
    postcssOptions: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
