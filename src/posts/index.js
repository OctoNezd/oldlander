import "~/css/postIcons.css";

import setupPostContainer from "./postContainer.js";
import setupThumbnail from "./thumbnail.js";
import setupExpando from "./expando.js";
import setupExpandoButton from "./expandoButton.js";
import setupNativeShare from "./nativeSharing.js";
import setupToggles from "./postToggles.js";
import { waitForAllElements } from "../utility/waitForElement.js";
import { loadedFeatures } from "../extensionPreferences";

function setupPost(post) {
    const postContainer = setupPostContainer(post);
    setupThumbnail(post);
    setupExpando(post);
    setupExpandoButton(postContainer);
    setupNativeShare(post);
    setupToggles(post);

    for (const feature of loadedFeatures) {
        feature.onPost(post);
    }

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
