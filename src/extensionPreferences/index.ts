import "./css/olPreferences.css";

import querySelectorAsync from "../utility/querySelectorAsync";
import PrefStore from "./baseStore";
import featureList from "../features";
import { OLFeature } from "../features/base";

export const store: PrefStore = new (
    __IS_USERSCRIPT__
        ? require("./userScriptStore").default
        : require("./webExtensionStore").default
)();
export const loadedFeatures: OLFeature[] = [];

async function createPreferencesUI() {
    document
        .querySelectorAll("#oldLanderPreferences")
        .forEach((el) => el.remove());
    const prefUI = document.createElement("div");
    prefUI.id = "oldLanderPreferences";
    await querySelectorAsync("body");
    document.body.appendChild(prefUI);

    const prefHeader = document.createElement("div");
    prefHeader.id = "oldLanderPrefHeader";

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.innerText = `🛸 OldLander v${__VERSION__} Preferences`;
    prefHeader.appendChild(titleDiv);

    const closeButton = document.createElement("button");
    closeButton.classList.add("material-symbols-outlined");
    closeButton.innerText = "close";
    closeButton.addEventListener("click", function () {
        location.hash = "";
        document.body.classList.remove("olPreferencesOpen");
        prefUI.remove();
    });
    prefHeader.appendChild(closeButton);

    prefUI.appendChild(prefHeader);
    for (const loadedFeature of loadedFeatures) {
        const featureSection = document.createElement("div");

        const title = document.createElement("p");
        title.classList.add("ol-setting-headline");
        title.innerText = `${loadedFeature.moduleName} (${loadedFeature.moduleId})`;
        featureSection.appendChild(title);

        for (const featureToggle of loadedFeature.settingOptions) {
            featureSection.appendChild(featureToggle.element);
        }

        prefUI.appendChild(featureSection);
    }

    document.body.classList.add("olPreferencesOpen");
    console.log("opened preferences ui");
}

async function hashHandle() {
    if (location.hash === "#olPreferences") {
        await createPreferencesUI();
    }
}
function handlePreferencesOpen() {
    addEventListener("hashchange", hashHandle);
    hashHandle();
}
function loadFeatures() {
    for (const feature of featureList) {
        const initialized = new feature();
        loadedFeatures.push(initialized);
    }
}
handlePreferencesOpen();
loadFeatures();
