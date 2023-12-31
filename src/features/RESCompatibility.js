import querySelectorAsync from "../utility/querySelectorAsync"
import { OLFeature, SettingButton } from "./base"

export default class RESCompatibility extends OLFeature {
    moduleId = "RESCSSDisable"
    moduleName = "Enhance compatibility with RES"
    async init() {
        await querySelectorAsync("html.res")
        this.settingOptions.push(
            new SettingButton("Disable selected post highlight", "Fixes white background on posts", () => {
                location.hash = "#res:settings/selectedEntry"
            }),
            new SettingButton("Disable comment boxes highlight", "Fixes white background on comments", () => {
                location.hash = "#res:settings/commentStyle/commentBoxes"
            }))
    }
}