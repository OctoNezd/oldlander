import { OLFeature, SettingButton } from "./base.ts";

function download(filename, text) {
    var element = document.createElement("a");
    element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

export default class ConsoleSave extends OLFeature {
    moduleName = "Log saver";
    moduleId = "logsaver";
    async init() {
        if (console.everything === undefined) {
            console.everything = [];
            function TS() {
                return (
                    new Date().toLocaleString("sv", { timeZone: "UTC" }) + "Z"
                );
            }
            window.onerror = function (error, url, line) {
                console.everything.push({
                    type: "exception",
                    timeStamp: TS(),
                    value: { error, url, line },
                });
                return false;
            };
            window.onunhandledrejection = function (e) {
                console.everything.push({
                    type: "promiseRejection",
                    timeStamp: TS(),
                    value: e.reason,
                });
            };

            function hookLogType(logType) {
                const original = console[logType].bind(console);
                return function () {
                    console.everything.push({
                        type: logType,
                        timeStamp: TS(),
                        value: Array.from(arguments),
                    });
                    original.apply(console, arguments);
                };
            }

            ["log", "error", "warn", "debug"].forEach((logType) => {
                console[logType] = hookLogType(logType);
            });
        }
        this.settingOptions.push(
            new SettingButton("Dump log", "Downloads JavaScript logs", () => {
                download(
                    `OldLanderLog-${new Date()}.json`,
                    JSON.stringify(console.everything, null, 2)
                );
            })
        );
    }
}
