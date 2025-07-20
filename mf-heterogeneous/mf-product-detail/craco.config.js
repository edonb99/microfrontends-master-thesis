const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  webpack: {
    configure: (config) => {
      config.output.publicPath = "http://localhost:4002/";
      config.plugins.push(
        new ModuleFederationPlugin({
          name: "product_detail",
          filename: "remoteEntry.js",
          exposes: {
            "./ProductDetail": "./src/ProductDetail",
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
    port: 4002,
  },
  style: {
    postcssOptions: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
