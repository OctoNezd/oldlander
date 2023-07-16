import baseStore from "./baseStore";
export default class UserScriptStore extends baseStore {
    set(key, value) {
        return GM.setValue(key, value);
    }
    get(key) {
        return GM.getValue(key);
    }
    name = "gmStore";
}
