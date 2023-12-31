import "./css/postIcons.css";

import setupPostContainer from "./postContainer";
import setupExpando from "./expando";
import setupExpandoButton from "./expandoButton";
import setupNativeShare from "./nativeSharing";
import setupToggles from "./postToggles";
import { OLFeature } from "../base";
import NativeShare from "./nativeSharing";

function setupPost(post: HTMLDivElement) {
    const postContainer = setupPostContainer(post);
    setupExpando(post);
    setupExpandoButton(postContainer);
    setupToggles(post);
}

// export default function setupPosts() {
//     waitForAllElements(".link:not(.ol-post-container .link)", setupPost);
// }

// setupPosts();
class PostsEnhance extends OLFeature {
    moduleId = "postsEnhance";
    moduleName = "Make posts more mobile-friendly";
    async onPost(post: HTMLDivElement) {
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
        setupPost(post)
    }
}
export default [PostsEnhance, NativeShare]