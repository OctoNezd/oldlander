import setupNativeShare from "./nativeSharing.js";
import setupToggles from "./postToggles.js";
import setupExpando from "./expando.js";
import setupExpandoButton from "./expandoButton.js";
import "~/css/postIcons.css";
import { waitForAllElements } from "../utility/waitForElement.js";

function setupPost(post) {
    // create new postContainer div to hold post & expando preview
    const postContainer = document.createElement("div");
    postContainer.classList.add("ol-post-container");
    const clearLeft = post.nextElementSibling; // i don't know what this div is but let's put it inside too
    post.before(postContainer);
    postContainer.appendChild(post);
    if (clearLeft) {
        postContainer.appendChild(clearLeft);
    }

    setupExpando(post);
    setupExpandoButton(postContainer);
    setupNativeShare(post);
    setupToggles(post);

    // trim comments to only first word (comment count)
    const comments = post.querySelector(".comments");
    if (comments !== null) {
        comments.innerText = comments.innerText.split(" ")[0];
        if (comments.innerText.includes("comment")) {
            comments.innerText = "0";
        }
    }

    // remove thumbnail no-image indicator. Could be done with CSS, but FF doesn't support :has.
    const thumbnail = post.querySelector(".thumbnail");
    if (thumbnail !== null && thumbnail.children.length === 0) {
        thumbnail.remove();
    }
    post.classList.add("riok");
}

export default function setupPosts() {
    waitForAllElements(".link:not(.ol-post-container .link)", setupPost);
}

setupPosts();
