import browser from "webextension-polyfill";
import baseStore from "./baseStore";

export default class WebExtStore extends baseStore {
    set(key: string, value: unknown) {
        const keyValuePair = {};
        keyValuePair[key] = value;
        return browser.storage.sync.set(keyValuePair);
    }
    get(key: string) {
        return browser.storage.sync.get(key);
    }
    name = "webExtStore";
}
