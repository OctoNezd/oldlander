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
export class SettingOption {
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
        this.element.innerHTML =
            `<span class="ol-set-inner"><p class="ol-set-title">${title}</p>` +
            `<p class="ol-set-desc">${description}</p></span><input type="checkbox" id="${settingId}" class="ol-setting-toggle-checkbox">`;
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
export class SettingSlider extends SettingOption {
    settingId: string;
    callback: (newState: number) => void;
    default: number = 0;
    minVal: number = 1;
    maxVal: number = Infinity;
    constructor(
        title: string,
        settingId: string,
        valSuffix: string,
        defaultValue: number,
        minValue: number,
        maxValue: number,
        callback: (newState: number) => void
    ) {
        super(title, "");
        this.settingId = settingId;
        this.callback = callback;
        this.minVal = minValue;
        this.maxVal = maxValue;
        this.default = defaultValue;
        this.element.classList.add("ol-setting-slider");
        this.element.innerHTML =
            `<span class="ol-set-inner"><p class="ol-set-title">${title}</p>` +
            `<span><span class="ol-set-val">${defaultValue}</span><span class="ol-set-description">${valSuffix}</span></span></span>` +
            `<input type="range" min="${minValue}" max="${maxValue}" value="${defaultValue}" id="${settingId}" class="ol-setting-range">`;
        this.element
            .querySelector("input")
            ?.addEventListener("change", (e) => this.update(e));
        this.loadPD();
    }
    async getValue(): Promise<number> {
        const prefData = await store.get(this.settingId);
        console.log("pd:", prefData);
        // @ts-ignore
        return prefData ?? this.default;
    }
    async loadPD() {
        const value = await this.getValue();
        this.element.querySelector("input")!.value = value.toString();
        (
            this.element.querySelector(".ol-set-val") as HTMLParagraphElement
        ).innerText = value.toString();
        this.callback(value);
    }
    async update(e: Event) {
        const new_value = Number((e.currentTarget as HTMLInputElement).value);
        if (new_value < this.minVal || new_value > this.maxVal) {
            console.log("invalid value, not updating storage");
            (e.currentTarget as HTMLInputElement).value = (
                await this.getValue()
            ).toString();
            return;
        }
        await store.set(this.settingId, new_value);
        console.log("updating", this.settingId, new_value);
        this.callback(new_value);
        (
            this.element.querySelector(".ol-set-val") as HTMLParagraphElement
        ).innerText = new_value.toString();
    }
}
