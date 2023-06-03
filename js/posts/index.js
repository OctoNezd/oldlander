import setupNativeShare from "./nativeSharing.js";
import setupToggles from "./postToggles.js";
import "@fortawesome/fontawesome-free/js/all.js";
import "@fortawesome/fontawesome-free/css/all.css";
import "~/css/postIcons.css";

export default function setupPosts() {
    for (const post of document.querySelectorAll(
        ".sitetable.linklisting > .thing:not(.riok)"
    )) {
        try {
            setupNativeShare(post);
        } catch (e) {
            console.error("Failed to setup native share", e);
        }
        try {
            setupToggles(post);
        } catch (e) {
            console.error("Failed to setup toggles", e);
        }
        // trim comments to only first word (comment count)
        const comments = post.querySelector(".comments");
        comments.innerText = comments.innerText.split(" ")[0];
        // remove thumbnail no-image indicator. Could be done with CSS, but FF doesn't support :has.
        const thumnbail = post.querySelector(".thumbnail");
        if (thumnbail.children.length === 0) {
            thumnbail.remove();
        }
        post.classList.add("riok");
    }
}
setupPosts();
window.addEventListener("neverEndingLoad", setupPosts);
