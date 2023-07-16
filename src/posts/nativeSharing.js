export default function setupNativeShare(post) {
    const redditButton = post.querySelector(".post-sharing-button");
    if (!redditButton) {
        return;
    }
    const redditBtnEl = redditButton.parentElement;
    redditBtnEl.innerHTML = "";
    const shareBtn = document.createElement("a");
    shareBtn.classList.add("riok-share");
    shareBtn.href = "javascript:void(0)";
    redditBtnEl.appendChild(shareBtn);
    shareBtn.onclick = function (e) {
        e.preventDefault();
        console.log(navigator);
        navigator.share({
            title: post.querySelector("a.title").innerText,
            url: post.dataset.permalink,
        });
    };
}
