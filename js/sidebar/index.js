import "swiped-events";
import buildSubredditSidebar from "./subredditSidebar.js";
import buildUserSidebar from "./userSidebar.js";

const eventListeners = {
    toggleUser: [],
    toggleSub: [],
    "swiped-right": [],
    "swiped-left": [],
};
let toggleSub, toggleUser, subSide, userSide;

function setEventListener(type, listener) {
    for (const currentListener of eventListeners[type]) {
        document.removeEventListener(type, currentListener);
    }
    document.addEventListener(type, listener);
    eventListeners[type] = [listener];
}

async function setupSubredditSidebar() {
    [toggleSub, subSide] = await buildSubredditSidebar();
    setSidebarEvents();
}
async function setupUserSidebar() {
    [toggleUser, userSide] = await buildUserSidebar();
    setSidebarEvents();
}

function setSidebarEvents() {
    if (toggleSub) {
        setEventListener("toggleSub", toggleSub);
    }
    if (toggleUser) {
        setEventListener("toggleUser", toggleUser);
    }
    setEventListener("swiped-right", function () {
        if (subSide && subSide.classList.contains("active")) {
            toggleSub();
        } else if (userSide && !userSide.classList.contains("active")) {
            toggleUser();
        }
    });
    setEventListener("swiped-left", function () {
        if (userSide && userSide.classList.contains("active")) {
            toggleUser();
        } else if (subSide && !subSide.classList.contains("active")) {
            toggleSub();
        }
    });
}

setupSubredditSidebar();
setupUserSidebar();
