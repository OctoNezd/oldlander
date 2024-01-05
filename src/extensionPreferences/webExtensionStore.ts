import browser from "webextension-polyfill";

export default class WebExtStore {
    set(key: string, value: unknown) {
        const keyValuePair: { [key: string]: unknown } = {};
        keyValuePair[key] = value;
        return browser.storage.sync.set(keyValuePair);
    }
    async get(key: string) {
        return (await browser.storage.sync.get(key))[key];
    }
    name = "webExtStore";
}
