export default function setupThumbnail(post) {
    const thumbnailLink = post.querySelector(".thumbnail");
    if (!thumbnailLink) {
        return;
    }

    // thumbnail links without children get removed, so add a child if there are none
    if (thumbnailLink.children.length == 0) {
        const thumbnailDiv = document.createElement("div");
        thumbnailLink.appendChild(thumbnailDiv);
    }
    const expando_btn = post.querySelector(".expando-button");
    if (expando_btn) {
        thumbnailLink.onclick = (e) => {
            e.preventDefault();
            expando_btn.click();
        };
    }
}
