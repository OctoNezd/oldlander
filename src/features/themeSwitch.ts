import { store } from "../extensionPreferences";
import { waitForElement } from "../utility/waitForElement";
import { OLFeature, SettingToggle } from "./base";

const systemThemeKey = "systemTheme"
const whiteThemeKey = "whiteTheme"

export default class WhiteTheme extends OLFeature {
    moduleId: string = "whiteTheme";
    moduleName: string = "Theme controls";
    async init () {
        this.settingOptions.push(
            new SettingToggle("White theme", "Enables white theme instead of dark.", whiteThemeKey, async (theme) => {
                const systemTheme = await store.get(systemThemeKey)
                if (systemTheme !== undefined && systemTheme) {
                    console.log("Systemtheme key is set, not enabling white theme")
                    return
                }
                waitForElement("body", () => {
                    document.body.classList.toggle("whiteTheme", theme)
                })
            })
        )
        this.settingOptions.push(
            new SettingToggle("System theme", "Makes oldlander follow system theme. Overrides white theme option", systemThemeKey, (followSystemTheme) => {
                if (followSystemTheme) {
                    this.followSystemTheme()
                    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.followSystemTheme)
                }
            })
        )
    }
    followSystemTheme() {
        const darkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        console.log("Dark theme?", darkTheme)
        waitForElement("body", () => {
            document.body.classList.toggle("whiteTheme", !darkTheme)
        })
    }
}