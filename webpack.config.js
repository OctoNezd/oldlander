const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const GenerateJsonPlugin = require("generate-json-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const path = require("path");

function getNextRevisionNumber(version) {
    // get a list of tags with the specified version number (but with any revision number)
    const existingVersions = require("child_process")
        .execSync(`git tag -l ${version}.*`)
        .toString()
        .split("\n");
    const revisionNumbers = existingVersions
        .map((fullVersion) =>
            parseInt(
                fullVersion.slice(version.length + 1) // +1 for the dot after the version number
            )
        )
        .filter((revision) => !isNaN(revision) && revision >= 0);
    // this will be the maximum number in the array, or -1 if the array is empty.
    // (actually it also returns -1 if all numbers are <= -1, but we filtered the array so that
    // all entries are nonnegative integers.)
    const latestRevision = revisionNumbers.reduce(
        (prev, cur) => Math.max(prev, cur),
        -1
    );
    const nextRevision = latestRevision + 1;
    if (!Number.isSafeInteger(nextRevision)) {
        throw new Error(
            `Next revision number ${nextRevision} is not a safe integer!`
        );
    }
    return nextRevision;
}

const version = require("./package.json").version;
const fullVersion = `${version}.${getNextRevisionNumber(version)}`;

const manifest = {
    manifest_version: 2,
    name: "OldLander",
    description:
        "General usability tweaks to old.reddit.com for mobile devices.",
    version: fullVersion,
    icons: {
        160: "icons/icon.png",
    },
    update_url:
        "https://raw.githubusercontent.com/OctoNezd/oldlander/chrome-ota/updates.xml",
    web_accessible_resources: ["riok_assets/*", "*.gif", "*.svg"],
    permissions: ["storage"],
    content_scripts: [
        {
            matches: ["*://*.reddit.com/*", "*://reddit.com/*"],
            js: ["./cs.js", "./vendors.js"],
            run_at: "document_start",
        },
    ],
    browser_specific_settings: {
        gecko: {
            id: "riok@octonezd.me",
            strict_min_version: "113.0",
        },
        gecko_android: {},
    },
};
const userScriptBanner = `// ==UserScript==
// @name         OldLander
// @namespace    https://github.com/OctoNezd/oldlander
// @homepageURL  https://github.com/OctoNezd/oldlander
// @downloadURL  https://github.com/OctoNezd/oldlander/releases/latest/download/oldlander.user.js
// @version      ${fullVersion}
// @description  Makes old reddit more usable on mobile devices.
// @author       OctoNezd
// @match        https://reddit.com/*
// @icon         https://raw.githubusercontent.com/OctoNezd/oldlander/main/icons/icon.png
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-start
// ==/UserScript==
`;

module.exports = (env, argv) => {
    if (env.BROWSER === "firefox" || env.BROWSER === "safari") {
        console.log("removing update url cause not chrome");
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
            cs: "./src/cs.ts",
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
            new webpack.DefinePlugin({
                __IS_USERSCRIPT__: JSON.stringify(env.BROWSER === "user.js"),
                __VERSION__: JSON.stringify(fullVersion),
            }),
            new GenerateJsonPlugin("manifest.json", manifest, null, 2),
        ],
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        "my-style-loader",
                        // Translates CSS into CommonJS
                        "css-loader",
                        // Compiles Sass to CSS
                        "sass-loader",
                    ],
                },
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
                {
                    test: /\.ts$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
                {
                    resourceQuery: /raw/,
                    type: "asset/source",
                },
            ],
        },
        resolveLoader: {
            alias: {
                "my-style-loader": path.resolve(
                    __dirname,
                    "./src/myStyleLoader/index.js"
                ),
            },
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".css"],
            alias: {
                "~": path.resolve(__dirname, "./src"),
            },
            extensions: [".ts", ".js"],
        },
    };
    if (argv.mode === "development") {
        webpackConfig.devtool = "inline-source-map";
    }
    if (env.BROWSER === "user.js") {
        console.log("Making user.js version");
        webpackConfig.entry = {
            "oldlander.user": "./src/user.ts",
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
        webpackConfig.module.rules[2] = {
            test: /\.(woff(2)?|ttf|eot)$/,
            type: "asset/inline",
        };
    }
    console.log("Resulting config:", webpackConfig);
    return webpackConfig;
};
