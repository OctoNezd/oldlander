const path = require("path");

module.exports = {
    pitch: function (request) {
        const insertStylePath = this.utils.contextify(
            this.context, path.resolve(__dirname, "./insertStyle.ts"));
        const cssPath = this.utils.contextify(this.context, `!!${request}`);

        const outputJs = `
        import insertStyle from ${JSON.stringify(insertStylePath)};
        import content from ${JSON.stringify(cssPath)};
        insertStyle(content);
        `;
        return outputJs;
    },
};
