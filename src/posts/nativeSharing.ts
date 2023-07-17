export default function setupNativeShare(post: HTMLDivElement) {
    const redditButton = post.querySelector<HTMLAnchorElement>(
        ".post-sharing-button"
    );
    if (!redditButton) {
        return;
    }
    redditButton.style.display = "none";
    const redditBtnEl = redditButton.parentElement;
    const shareBtn = document.createElement("a");
    shareBtn.classList.add("riok-share");
    shareBtn.href = "javascript:void(0)";
    redditBtnEl.appendChild(shareBtn);
    shareBtn.onclick = function (e) {
        e.preventDefault();
        if (navigator.canShare) {
            navigator.share({
                title: post.querySelector<HTMLAnchorElement>("a.title")
                    .innerText,
                url: post.dataset.permalink,
            });
        } else {
            redditButton.click();
        }
    };
}
