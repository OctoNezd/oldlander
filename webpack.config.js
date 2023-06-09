const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const GenerateJsonPlugin = require("generate-json-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const path = require("path");
const version = require("./package.json").version;
ver_offset = 1;
revision =
    parseInt(
        require("child_process")
            .execSync("git rev-list --all --count")
            .toString()
            .trim()
            .slice(0, 7)
    ) + ver_offset;
const manifest = {
    manifest_version: 2,
    name: "OldLander",
    description:
        "General usability tweaks to old.reddit.com for mobile devices.",
    version: version + "." + revision,
    icons: {
        160: "icons/icon.png",
    },
    update_url:
        "https://raw.githubusercontent.com/OctoNezd/oldlander/chrome-ota/updates.xml",
    web_accessible_resources: ["riok_assets/*"],
    content_scripts: [
        {
            matches: ["*://old.reddit.com/*"],
            js: ["./cs.js", "./vendors.js"],
            run_at: "document_start",
        },
    ],
    browser_specific_settings: {
        gecko: {
            id: "riok@octonezd.me",
            strict_min_version: "48.0",
        },
    },
};
const userScriptBanner = `// ==UserScript==
// @name         OldLander
// @namespace    https://github.com/OctoNezd/oldlander
// @homepageURL  https://github.com/OctoNezd/oldlander
// @downloadURL  https://github.com/OctoNezd/oldlander/releases/latest/download/oldlander.user.js
// @version      ${version + "." + revision}
// @description  Makes old reddit more usable on mobile devices.
// @author       OctoNezd
// @match        https://old.reddit.com/*
// @icon         https://raw.githubusercontent.com/OctoNezd/oldlander/main/icons/icon.png
// @grant        none
// @run-at       document-start
// ==/UserScript==
`;

module.exports = (env, argv) => {
    if (env.BROWSER === "firefox") {
        console.log("removing update url cause firefox");
        delete manifest.update_url;
    }
    const webpackConfig = {
        devtool: "source-map",
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        enforce: true,
                        chunks: "all",
                    },
                },
            },
        },
        entry: {
            cs: "./js/cs.js",
        },
        output: {
            filename: "[name].js",
            path: __dirname + "/dist",
            clean: true,
            publicPath: "extension://placeholder_not_real_path",
        },
        plugins: [
            new CopyPlugin({
                patterns: [{ from: "icons", to: "icons" }],
            }),
            new GenerateJsonPlugin("manifest.json", manifest, null, 2),
        ],
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ["my-style-loader", "css-loader"],
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
        resolveLoader: {
            alias: {
                "my-style-loader": path.resolve(
                    __dirname,
                    "./dev/my_style_loader/index.js"
                ),
            },
        },
        resolve: {
            alias: {
                "~": path.resolve(__dirname, "."),
            },
        },
    };
    if (argv.mode === "development") {
        webpackConfig.devtool = "inline-source-map";
    }
    if (env.BROWSER === "user.js") {
        console.log("Making user.js version");
        webpackConfig.entry = {
            "oldlander.user": "./js/user.js",
        };
        delete webpackConfig.optimization;
        webpackConfig.plugins.push(
            new webpack.BannerPlugin({
                banner: userScriptBanner,
                raw: true,
            }),
            // https://github.com/webpack/webpack/issues/6630
            new TerserWebpackPlugin({
                terserOptions: {
                    compress: {
                        passes: 2,
                    },
                    output: {
                        comments: function (node, comment) {
                            if (global.bannerStarted === undefined) {
                                global.bannerStarted = false;
                                console.log("defining bannerStarted");
                            }
                            if (comment.value.includes("==UserScript==")) {
                                bannerStarted = true;
                            }

                            if (bannerStarted === true) {
                                if (comment.value.includes("==/UserScript==")) {
                                    bannerStarted = false;
                                }
                                return true;
                            }
                            return false;
                        },
                    },
                },
                extractComments: false,
            })
        );
        webpackConfig.module.rules[1] = {
            test: /\.(woff(2)?|ttf|eot)$/,
            type: "asset/inline",
        };
    }
    console.log("Resulting config:", webpackConfig);
    return webpackConfig;
};
