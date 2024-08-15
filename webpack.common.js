const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    entry: {
        app: "./src/index.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Production",
        }),
    ],
    output: {
        filename: "main.bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
};