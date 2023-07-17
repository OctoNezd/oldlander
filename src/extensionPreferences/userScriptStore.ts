import baseStore from "./baseStore";

declare const GM: {
    getValue: (key: string) => Promise<Record<string, unknown>>;
    setValue: (key: string, value: unknown) => Promise<void>;
};

export default class UserScriptStore extends baseStore {
    set(key: string, value: unknown) {
        return GM.setValue(key, value);
    }
    get(key: string) {
        return GM.getValue(key);
    }
    name = "gmStore";
}
