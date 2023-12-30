import { OLFeature, SettingToggle } from "../base";
import "swiped-events";
import buildSubredditSidebar from "./subredditSidebar";
import buildUserSidebar from "./userSidebar";
import "./css/prefs.css";

const eventListeners: { [id: string]: ((event: Event) => void)[] } = {
    toggleUser: [],
    toggleSub: [],
    "swiped-right": [],
    "swiped-left": [],
};

function setEventListener(type: string, listener: (event: Event) => void) {
    for (const currentListener of eventListeners[type]) {
        document.removeEventListener(type, currentListener);
    }
    document.addEventListener(type, listener);
    eventListeners[type] = [listener];
}

const swipeIgnoreTags = ["PRE", "CODE"]

const toggleAbles = [
    {name: "Disable random NSFW", settingId: "disableNSFW", className: "ol_noRandNsfw"},
    {name: "Disable random", settingId: "disableRandom", className: "ol_noRandom"},
]

export default class Sidebar extends OLFeature {
    moduleName = "Sidebar";
    moduleId = "sidebar";
    
    subSide: HTMLDivElement | undefined
    userSide: HTMLDivElement | undefined
    subToggle!: () => void | undefined;
    userToggle!: () => void | undefined

    async init() {
        console.log("Initializing Sidebar");
        for (const setting of toggleAbles) {
            this.settingOptions.push(
                new SettingToggle(setting.name, "", setting.settingId, (toggle) => {
                    if (toggle) {
                        document.documentElement.classList.add(setting.className)
                    } else {
                        document.documentElement.classList.remove(setting.className)
                    }
                })
            );
        }
        await this.setupSubredditSidebar();
        await this.setupUserSidebar();
        this.setSidebarEvents();
    }

    async setupSubredditSidebar() {
        const sub = await buildSubredditSidebar();
        console.log("Built subreddit sidebar", sub);
        this.subSide = sub.sidebar;
        this.subToggle = sub.activeToggle;
        console.log(this.subToggle, sub.activeToggle)
    }
    async setupUserSidebar() {
        const user = await buildUserSidebar();
        console.log("Built user sidebar", user);
        this.userSide = user.sidebar;
        this.userToggle = user.activeToggle;
    }
    
    setSidebarEvents() {
        console.log("Setting up sidebar events, handlers:", this.subToggle, this.userToggle)
        setEventListener("toggleSub", this.subToggle);
        setEventListener("toggleUser", this.userToggle);
        setEventListener("swiped-right",  (event) => {
            const target = event.target as HTMLElement;
            if (target && swipeIgnoreTags.includes(target.tagName)) {
                return
            }
            if (this.subSide && this.subSide.classList.contains("active")) {
                this.subToggle();
            } else if (this.userSide && !this.userSide.classList.contains("active")) {
                this.userToggle();
            }
        });
        setEventListener("swiped-left",  (event) => {
            const target = event.target as HTMLElement;
            if (target && swipeIgnoreTags.includes(target.tagName)) {
                return
            }
            if (this.userSide && this.userSide.classList.contains("active")) {
                this.userToggle();
            } else if (this.subSide && !this.subSide.classList.contains("active")) {
                this.subToggle();
            }
        });
    }    
}