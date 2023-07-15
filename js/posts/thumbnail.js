export default function setupThumbnail(post) {
    const thumbnailLink = post.querySelector(".thumbnail");
    if (!thumbnailLink) {
        return;
    }

    const thumbnailDiv = document.createElement("div");
    thumbnailDiv.classList.add("thumbnail");
    thumbnailLink.replaceWith(thumbnailDiv);
    thumbnailDiv.appendChild(thumbnailLink);

    const expando_btn = post.querySelector(".expando-button");
    thumbnailDiv.addEventListener("click", (e) => {
        e.preventDefault();
        if (expando_btn) {
            expando_btn.click();
        }
    });
}
