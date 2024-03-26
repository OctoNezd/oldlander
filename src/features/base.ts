import { store } from "../extensionPreferences";
export class OLFeature {
    moduleName = "unset";
    moduleId = "unset";
    settingOptions: Array<SettingOption> = [];
    constructor() {
        this.init();
    }
    async init() {
        return;
    }
    async onPost(post: HTMLDivElement) {
        return;
    }
}
class SettingOption {
    element: HTMLDivElement;
    constructor(title: string, description: string) {
        this.element = document.createElement("div");
        this.element.className = "ol-setting";
        this.element.innerHTML = `<span class="ol-set-inner"><p class="ol-set-title">${title}</p><p class="ol-set-desc">${description}</p></span>`;
    }
    async createItem() {}
}
export class SettingButton extends SettingOption {
    constructor(title: string, description: string, callback: Function) {
        super(title, description);
        this.element.classList.add("ol-setting-button");
        this.element.addEventListener("click", () => callback());
    }
}

export class SettingToggle extends SettingOption {
    settingId: string;
    callback: (newState: boolean) => void;
    constructor(
        title: string,
        description: string,
        settingId: string,
        callback: (newState: boolean) => void
    ) {
        super(title, description);
        this.settingId = settingId;
        this.callback = callback;
        this.element.classList.add("ol-setting-toggle");
        this.element.innerHTML = `<span class="ol-set-inner"><p class="ol-set-title">${title}</p><p class="ol-set-desc">${description}</p></span><input type="checkbox" id="${settingId}" class="ol-setting-toggle-checkbox">`;
        this.element.addEventListener(
            "click",
            async () => await this.toggleSetting()
        );
        this.loadPD();
    }
    async getValue(): Promise<boolean> {
        const prefData = await store.get(this.settingId);
        return !!prefData;
    }
    async loadPD() {
        const value = await this.getValue();
        this.element.querySelector("input")!.checked = value;
        this.callback(value);
    }
    async toggleSetting() {
        const prefData = await store.get(this.settingId);
        const old_value = prefData;
        const new_value = !old_value;
        await store.set(this.settingId, new_value);
        console.log("updating", this.settingId, old_value, new_value);
        this.element.querySelector("input")!.checked = !old_value;
        this.callback(new_value);
    }
}
