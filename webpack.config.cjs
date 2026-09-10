const path = require("path");

module.exports = {
  mode: "production",

  entry: "./src/callcontrol.js",

  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader"
      }
    ]
  }
};