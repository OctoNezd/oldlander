export class SettingSection {
    moduleName = "unset";
    moduleId = "unset";
    settingOptions: Array<SettingOption> = [];
    constructor() {
        this.init();
    }
    async init() {
        return;
    }
}
class SettingOption {
    element: HTMLDivElement;
    constructor(title: string, description: string) {
        this.element = document.createElement("div");
        this.element.className = "ol-setting";
        this.element.innerHTML = `<p class="ol-set-title">${title}</p><p class="ol-set-desc">${description}</p>`;
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
