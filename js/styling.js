import "~/css/hideAds.css";
import "~/css/redditChanges.css";
import "~/css/customUi.css";
import "~/css/resFullscreenGallery.css";
import "~/css/material/theme.css";
import "~/css/res-compat.css";
import "~/css/comments.css";
import "material-symbols/outlined.css";

import querySelectorAsync from "./utility/querySelectorAsync";

async function reinjectStyling() {
    await querySelectorAsync('head > style[type="text/css"]');
    for (const style of document.head.querySelectorAll(".ol-style")) {
        document.head.appendChild(style);
    }
}

async function removeSubredditStyling() {
    const element = await querySelectorAsync(
        "link[title=applied_subreddit_stylesheet]"
    );
    element.remove();
    console.log("Subreddit stylesheet removed");
}

async function addBodyStyling() {
    const body = await querySelectorAsync("body");
    body.classList.add("background", "on-background-text");
}

reinjectStyling();
removeSubredditStyling();
addBodyStyling();

// over18
if (!document.cookie.includes("over18=1")) {
    console.log("over18 not set, setting");
    document.cookie = "over18=1";
}
