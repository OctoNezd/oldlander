import "./css/postIcons.css";

import setupPostContainer from "./postContainer";
import setupExpando from "./expando";
import setupExpandoButton from "./expandoButton";
import setupNativeShare from "./nativeSharing";
import setupToggles from "./postToggles";

import { waitForAllElements } from "../utility/waitForElement";
import { loadedFeatures } from "../extensionPreferences";

function setupPost(post: HTMLDivElement) {
    const postContainer = setupPostContainer(post);
    setupExpando(post);
    setupExpandoButton(postContainer);
    setupNativeShare(post);
    setupToggles(post);

    for (const feature of loadedFeatures) {
        feature.onPost(post);
    }

    // trim comments to only first word (comment count)
    const comments = post.querySelector<HTMLAnchorElement>(".comments");
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
