export const store = new (
    IS_USERSCRIPT
        ? require("./userScriptStore").default
        : require("./webExtensionStore").default
)();
import "~/css/olPreferences.css";
import querySelectorAsync from "../utility/querySelectorAsync";
import featureList from "./features";
const loadedFeatures = [];
async function createPreferencesUI() {
    document
        .querySelectorAll("#oldLanderPreferences")
        .forEach((el) => el.remove());
    const pui = document.createElement("div");
    pui.id = "oldLanderPreferences";
    await querySelectorAsync("body");
    document.body.appendChild(pui);

    const hdr = document.createElement("div");
    hdr.innerHTML = `<div class="title">
    🛸 OldLander v${VERSION} Preferences
                        </div>
                        <button class="material-symbols-outlined">close</button>`;
    hdr.id = "oldLanderPrefHeader";
    hdr.querySelector("button").addEventListener("click", function () {
        location.hash = "";
        document.body.classList.remove("olPreferencesOpen");
        pui.remove();
    });
    pui.appendChild(hdr);
    for (const loadedFeature of loadedFeatures) {
        const featureSection = document.createElement("div");

        const title = document.createElement("p");
        title.classList.add("ol-setting-headline");
        title.innerText = `${loadedFeature.moduleName} (${loadedFeature.moduleId})`;
        featureSection.appendChild(title);

        for (const featureToggle of loadedFeature.settingOptions) {
            featureSection.appendChild(featureToggle.element);
        }

        pui.appendChild(featureSection);
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
