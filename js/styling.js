import "~/css/hideAds.css";
import "~/css/redditChanges.css";
import "~/css/customUi.css";
import "~/css/resFullscreenGallery.css";
import "~/css/material/theme.css";
import "~/css/res-compat.css";
import "~/css/comments.css";
import "material-symbols/outlined.css";

function neuterSubredditCss() {
    try {
        document
            .querySelector("link[title=applied_subreddit_stylesheet]")
            .remove();
    } catch (e) {
        console.log("failed to remove subreddit stylesheet");
    }
}

function materialize() {
    document.body.classList.add("background", "on-background-text");
}

neuterSubredditCss();
materialize();
// over18
if (!document.cookie.includes("over18=1")) {
    console.log("over18 not set, setting");
    document.cookie = "over18=1";
}
