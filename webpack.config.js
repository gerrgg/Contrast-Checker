const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";
  const base = isProd ? "/contrast-checker/" : "/";

  return {
    entry: "./src/index.js",
    output: {
      filename: isProd ? "assets/app.[contenthash:8].js" : "assets/app.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: base,
      clean: { keep: /index\.html/ },
    },

    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { targets: "defaults" }]],
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: { sourceMap: !isProd, url: true },
            },
            { loader: "postcss-loader", options: { sourceMap: !isProd } },
            { loader: "sass-loader", options: { sourceMap: !isProd } },
          ],
        },
        {
          test: /\.(woff2?|ttf|otf|eot)$/i,
          type: "asset/resource",
          generator: { filename: "assets/fonts/[contenthash:8][ext]" },
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
          generator: { filename: "assets/img/[contenthash:8][ext]" },
        },
      ],
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: isProd ? "assets/app.[contenthash:8].css" : "assets/app.css",
      }),

      new HtmlWebpackPlugin({
        template: "./src/index.html",
        filename: "index.html",
      }),
    ],

    optimization: isProd
      ? {
          runtimeChunk: "single",
          splitChunks: { chunks: "all" },
        }
      : undefined,

    devServer: {
      static: { directory: path.resolve(__dirname, "dist") },
      hot: true,
      port: 3002,
      open: true,
      watchFiles: ["src/**/*"],
    },
  };
};
