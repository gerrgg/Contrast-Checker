const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";
  const base = isProd ? "/contrast-checker/" : "/";

  return {
    entry: "./src/index.js",
    output: {
      filename: "assets/app.js",
      path: path.resolve(__dirname, "dist"),
      publicPath: base, // or "auto"
      clean: { keep: /index\.html/ },
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
          generator: {
            filename: "assets/fonts/[hash][ext][query]",
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/img/[hash][ext][query]",
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "assets/app.css",
      }),
    ],
    devServer: {
      static: { directory: path.resolve(__dirname, "dist") },
      hot: true,
      port: 3002,
      open: true,
      watchFiles: ["src/**/*"],
    },
  };
};
