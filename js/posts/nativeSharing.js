export default function setupNativeShare(post) {
    const redditBtnEl = post.querySelector(
        ".post-sharing-button"
    ).parentElement;
    redditBtnEl.innerHTML = "";
    const shareBtn = document.createElement("a");
    shareBtn.classList.add("riok-share");
    shareBtn.href = "javascript:void(0)";
    redditBtnEl.appendChild(shareBtn);
    shareBtn.onclick = function (e) {
        e.preventDefault();
        navigator.share({
            title: post.querySelector("a.title").innerText,
            url: post.dataset.permalink,
        });
    };
}
