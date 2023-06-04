const CopyPlugin = require("copy-webpack-plugin");
const GenerateJsonPlugin = require("generate-json-webpack-plugin");
const path = require("path");
const version = require("./package.json").version;
revision = require("child_process")
    .execSync("git rev-list --all --count")
    .toString()
    .trim()
    .slice(0, 7);
module.exports = {
    mode: "development",
    devtool: "source-map",
    optimization: {
        splitChunks: {
            chunks: "all",
        },
        runtimeChunk: "single",
    },
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
            patterns: [{ from: "icons", to: "icons" }],
        }),
        new GenerateJsonPlugin(
            "manifest.json",
            {
                manifest_version: 2,
                name: "mobreddit",
                description:
                    "General usability tweaks to old.reddit.com for mobile devices.",
                version: version + "." + revision,
                icons: {
                    64: "icons/icon.png",
                },
                web_accessible_resources: ["riok_assets/*"],
                content_scripts: [
                    {
                        matches: ["*://old.reddit.com/*"],
                        js: ["./viewport.js"],
                        run_at: "document_start",
                    },
                    {
                        matches: ["*://old.reddit.com/*"],
                        js: ["./cs.js"],
                    },
                    {
                        matches: ["*://old.reddit.com/r/*"],
                        js: ["./subreddit.js"],
                        run_at: "document_start",
                    },
                ],
                browser_specific_settings: {
                    gecko: {
                        id: "riok@octonezd.me",
                        strict_min_version: "48.0",
                    },
                },
            },
            (k, v) => v,
            2
        ),
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
