const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
module.exports = {
    entry: {
        cs: "./js/cs.js",
        viewport: "./js/viewport.js",
        subreddit: "./js/subreddit.js",
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist",
        clean: true,
        publicPath: "extension://aaaa",
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "manifest.json", to: "" },
                { from: "css", to: "css" },
                { from: "icons", to: "icons" },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                type: "asset/resource",
                generator: {
                    filename: "./riok_assets/[name][ext]",
                },
            },
        ],
    },
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "."),
        },
    },
};
