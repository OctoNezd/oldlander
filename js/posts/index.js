import setupNativeShare from "./nativeSharing.js";
import setupToggles from "./postToggles.js";
import expando from "./expando.js";
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
        if (comments !== null) {
            comments.innerText = comments.innerText.split(" ")[0];
            if (comments.innerText.includes("comment")) {
                comments.innerText = "0";
            }
        }
        const expando_btn = post.querySelector(".expando-button");
        if (expando_btn !== null) {
            if (
                expando_btn.getAttribute("title") === "Expando is not yet ready"
            ) {
                const attrObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mu) => {
                        if (
                            mu.type !== "attributes" &&
                            mu.attributeName !== "class"
                        )
                            return;
                        console.log("class was modified!");
                        expando(post);
                        attrObserver.disconnect();
                    });
                });
                console.log(
                    "Expando is not ready yet, setting up mutation observer for",
                    expando_btn
                );
                attrObserver.observe(expando_btn, { attributes: true });
            } else {
                expando(post);
            }
        }

        // remove thumbnail no-image indicator. Could be done with CSS, but FF doesn't support :has.
        const thumbnail = post.querySelector(".thumbnail");
        if (thumbnail !== null && thumbnail.children.length === 0) {
            thumbnail.remove();
        }
        post.classList.add("riok");
    }
}
setupPosts();
window.addEventListener("neverEndingLoad", setupPosts);
