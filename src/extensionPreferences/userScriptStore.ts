declare const GM: {
    getValue: (key: string) => Promise<Record<string, unknown>>;
    setValue: (key: string, value: unknown) => Promise<void>;
};

export default class UserScriptStore {
    set(key: string, value: unknown) {
        return GM.setValue(key, value);
    }
    async get(key: string) {
        let val = await GM.getValue(key);
        if (val === undefined) return val;
        return val[key];
    }
    name = "gmStore";
}
