import browser from "webextension-polyfill";
import baseStore from "./baseStore";

export default class WebExtStore extends baseStore {
    set(key, value) {
        return browser.storage.sync.set([key, value]);
    }
    get(key) {
        return browser.storage.sync.get(key);
    }
    name = "webExtStore";
}
