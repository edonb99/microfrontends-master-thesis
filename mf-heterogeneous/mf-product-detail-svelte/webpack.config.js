const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = (env, argv) => ({
  mode: argv.mode || "development",
  entry: "./src/index.js",
  devServer: {
    port: 4002,
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            compilerOptions: {
              dev: argv.mode === "development"
            },
            emitCss: true,
            hotReload: argv.mode === "development"
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.m?js$/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react", "@babel/preset-env"],
          plugins: ["@babel/plugin-transform-runtime"],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "mfproductdetail",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductDetail": "./src/ProductDetail",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  resolve: {
    alias: {
      svelte: require.resolve('svelte')
    },
    extensions: ['.mjs', '.js', '.jsx', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  }
});
