const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

console.log("OUTPUT: " + path.join(__dirname, "dist"));

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    dashboard: "./src/page-dashboard/index.js",
    backlog: "./src/page-backlog/index.js",
    //detail: "./src/page-detail/index.js",
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 8082,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "/",
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {},
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin(
      [{ from: "src/page-dashboard/**", to: "page-dashboard/", flatten: true }],
      { ignore: ["**/*.js", "**/*.css"] }
    ),
    new CopyWebpackPlugin(
      [{ from: "src/page-backlog/**", to: "page-backlog/", flatten: true }],
      { ignore: ["**/*.js", "**/*.css"] }
    ),
    new CopyWebpackPlugin(
      [{ from: "src/page-detail/**", to: "page-detail/", flatten: true }],
      { ignore: ["**/*.js", "**/*.css"] }
    ),
  ],
  resolve: {
    extensions: [".js", ".css"],
  },
  output: {
    filename: "[name].bundle.js",
    path: __dirname + "/dist",
  },
  //target: 'node',
  //externals: [nodeExternals()],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendor",
          chunks: "all",
          test: (module, chunks) => {
            const moduleName = module.nameForCondition
              ? module.nameForCondition()
              : "";
            return /[\\/]node_modules[\\/]/.test(moduleName);
          },
          enforce: true,
        },
      },
    },
  },
};
