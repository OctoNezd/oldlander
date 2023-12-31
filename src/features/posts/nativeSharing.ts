import { OLFeature } from "../base";

export default class NativeShare extends OLFeature {
    moduleId = "nativeShare";
    moduleName = "Posts native sharing";
    async onPost(post: HTMLDivElement) {
        const redditButton = post.querySelector<HTMLAnchorElement>(
            ".post-sharing-button"
        );
        if (!redditButton) {
            return;
        }
        redditButton.style.display = "none";
        const redditBtnEl = redditButton.parentElement!;
        const shareBtn = document.createElement("a");
        shareBtn.classList.add("riok-share");
        shareBtn.href = "javascript:void(0)";
        redditBtnEl.appendChild(shareBtn);
        shareBtn.onclick = function (e) {
            e.preventDefault();
            const shareData = {
                title: post.querySelector<HTMLAnchorElement>("a.title")?.innerText,
                url: post.dataset.permalink,
            };
            if (navigator.canShare && navigator.canShare(shareData)) {
                navigator.share(shareData);
            } else {
                redditButton.click();
            }
        };
    }
}