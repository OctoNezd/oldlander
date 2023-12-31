import { waitForElement } from "../utility/waitForElement";
import { OLFeature, SettingToggle } from "./base";

const marqueeSettingId = "marquee";

export default class RedditMarquee extends OLFeature {
    moduleId = "marquee";
    moduleName = "Subreddit marquee list";
    async init() {
        this.settingOptions.push(
            new SettingToggle("Marquee toggle", "Enables old reddit marquee", marqueeSettingId, async (toggle) => {
                document.documentElement.classList.toggle("redditMarqueEnabled", toggle)
            })
        );
        waitForElement("#sr-header-area", (element) => {
            document.body.appendChild(element)
        })
    }
}
