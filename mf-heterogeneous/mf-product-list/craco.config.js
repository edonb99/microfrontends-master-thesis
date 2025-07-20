const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  webpack: {
    configure: (config) => {
      config.output.publicPath = "http://localhost:4001/";
      config.plugins.push(
        new ModuleFederationPlugin({
          name: "product_list",
          filename: "remoteEntry.js",
          exposes: {
            "./ProductList": "./src/ProductList",
          },
          shared: {
            react: { 
              singleton: true, 
              requiredVersion: false,
              eager: true
            },
            "react-dom": { 
              singleton: true, 
              requiredVersion: false,
              eager: true
            },
            "react-router-dom": { 
              singleton: true, 
              requiredVersion: false,
              eager: true
            },
          },
        })
      );
      return config;
    },
  },
  devServer: {
    port: 4001,
  },
  style: {
    postcssOptions: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
