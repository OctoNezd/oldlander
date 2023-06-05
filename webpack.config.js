const CopyPlugin = require("copy-webpack-plugin");
const GenerateJsonPlugin = require("generate-json-webpack-plugin");
const path = require("path");
const version = require("./package.json").version;
revision = require("child_process")
    .execSync("git rev-list --all --count")
    .toString()
    .trim()
    .slice(0, 7);
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
            js: ["./viewport.js"],
            run_at: "document_start",
        },
        {
            matches: ["*://old.reddit.com/*"],
            js: ["./cs.js", "./vendors.js"],
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
};

module.exports = (env) => {
    if (env.BROWSER === "firefox") {
        console.log("removing update url cause firefox");
        delete manifest.update_url;
    }
    return {
        mode: "development",
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
            new GenerateJsonPlugin("manifest.json", manifest, null, 2),
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
};
