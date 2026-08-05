import "./css/olPreferences.css";

import querySelectorAsync from "../utility/querySelectorAsync";
import PrefStore from "./baseStore";
import featureList from "../features";
import { OLFeature } from "../features/base";
import { waitForAllElements } from "../utility/waitForElement";

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
        if (loadedFeature.settingOptions.length !== 0) {
            prefUI.appendChild(featureSection);
        }
    }

    document.body.classList.add("olPreferencesOpen");
    console.log("opened preferences ui");
}

function destroyPreferencesUI() {
    if (document.body) {
        document.body.classList.remove("olPreferencesOpen");
    }
    const prefUI = document.querySelector("#oldLanderPreferences");
    if (prefUI) {
        prefUI?.remove();
    }
}

async function onHashChange() {
    if (location.hash === "#olPreferences") {
        await createPreferencesUI();
    } else {
        destroyPreferencesUI();
    }
}

function loadFeatures() {
    for (const feature of featureList) {
        const initialized = new feature;
        console.log("Loaded", initialized)
        loadedFeatures.push(initialized);
    }
}

loadFeatures();
// the .clearleft is the last element in a link post. we need all the elements present for link posts so that setupPostContainer
// can move them into the container. on the other hand, comments aren't subject to setupPostContainer, so we can process them as
// soon as the .child element occurs. this avoids having to wait for all their replies to load.
waitForAllElements(".link:not(.ol-post-container .link) > .clearleft, .comment > .child", (marker: HTMLElement) => {
    const post = marker.parentElement as HTMLDivElement;
    if (post.classList.contains("riok")) {
        return
    }
    loadedFeatures.forEach(async (feature: OLFeature) => {
        await feature.onPost(post);
    });
    post.classList.add("riok");
});
addEventListener("hashchange", onHashChange);
onHashChange();
