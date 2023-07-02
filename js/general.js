import "~/css/hideAds.css";
import "~/css/redditChanges.css";
import "~/css/customUi.css";
import "~/css/resFullscreenGallery.css";
import "~/css/material/theme.css";
import "~/css/res-compat.css";
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
