const CopyPlugin = require("copy-webpack-plugin");
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
};
