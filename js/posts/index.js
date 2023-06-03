import setupNativeShare from "./nativeSharing.js";
export default function setupPosts() {
    for (const post of document.querySelectorAll(
        ".sitetable.linklisting > .thing:not(.riok)"
    )) {
        setupNativeShare(post);
        post.classList.add("riok");
    }
}
setupPosts();
window.addEventListener("neverEndingLoad", setupPosts);
