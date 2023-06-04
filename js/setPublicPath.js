import browser from "webextension-polyfill";
__webpack_public_path__ = browser.runtime.getURL(".");
console.log("public path is", __webpack_public_path__);
