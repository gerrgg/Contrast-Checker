const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { watch } = require("fs");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    entry: "./src/index.js",
    output: {
      filename: "assets/app.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
      clean: true,
    },
    devtool: isProd ? "source-map" : "eval-source-map",
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
            { loader: "css-loader", options: { sourceMap: !isProd } },
            { loader: "postcss-loader", options: { sourceMap: !isProd } },
            { loader: "sass-loader", options: { sourceMap: !isProd } },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "assets/app.css",
      }),
    ],
    devServer: {
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      hot: true,
      port: 3000,
      open: true,
      watchFiles: ["src/**/*"],
    },
  };
};
