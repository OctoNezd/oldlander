export default function setupThumbnail(post) {
    const thumbnailLink = post.querySelector(".thumbnail");
    if (!thumbnailLink) {
        return;
    }

    const thumbnailDiv = document.createElement("div");
    thumbnailDiv.classList.add("thumbnail");
    thumbnailLink.replaceWith(thumbnailDiv);
    thumbnailDiv.appendChild(thumbnailLink);

    thumbnailDiv.addEventListener("click", (e) => {
        e.preventDefault();
        const expando_btn = post.querySelector(".expando-button");
        if (expando_btn) {
            expando_btn.click();
        }
    });
}
