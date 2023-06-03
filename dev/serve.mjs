import webExt from "web-ext";
import * as adbUtils from "web-ext/util/adb";
const adbDevice = (await adbUtils.listADBDevices())[0];
console.log("Running on", adbDevice);
const firefoxApk = "org.mozilla.fenix";
webExt.cmd.run({
    target: "firefox-android",
    firefoxApk,
    adbDevice,
    sourceDir: "./dist",
});
