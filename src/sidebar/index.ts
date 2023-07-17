import "swiped-events";
import buildSubredditSidebar from "./subredditSidebar";
import buildUserSidebar from "./userSidebar";

const eventListeners: { [id: string]: (() => void)[] } = {
    toggleUser: [],
    toggleSub: [],
    "swiped-right": [],
    "swiped-left": [],
};

let subSide: HTMLDivElement | undefined,
    userSide: HTMLDivElement | undefined,
    subToggle: () => void | undefined,
    userToggle: () => void | undefined;

function setEventListener(type: string, listener: () => void) {
    for (const currentListener of eventListeners[type]) {
        document.removeEventListener(type, currentListener);
    }
    document.addEventListener(type, listener);
    eventListeners[type] = [listener];
}

async function setupSubredditSidebar() {
    const sub = await buildSubredditSidebar();
    subSide = sub.sidebar;
    subToggle = sub.activeToggle;
    setSidebarEvents();
}
async function setupUserSidebar() {
    const user = await buildUserSidebar();
    userSide = user.sidebar;
    userToggle = user.activeToggle;
    setSidebarEvents();
}

function setSidebarEvents() {
    if (subToggle) {
        setEventListener("toggleSub", subToggle);
    }
    if (userToggle) {
        setEventListener("toggleUser", userToggle);
    }
    setEventListener("swiped-right", function () {
        if (subSide && subSide.classList.contains("active")) {
            subToggle();
        } else if (userSide && !userSide.classList.contains("active")) {
            userToggle();
        }
    });
    setEventListener("swiped-left", function () {
        if (userSide && userSide.classList.contains("active")) {
            userToggle();
        } else if (subSide && !subSide.classList.contains("active")) {
            subToggle();
        }
    });
}

setupSubredditSidebar();
setupUserSidebar();
