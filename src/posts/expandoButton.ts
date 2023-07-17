function addImagePostClass(postContainer: HTMLDivElement) {
    const expando_btn =
        postContainer.querySelector<HTMLButtonElement>(".expando-button");
    if (!expando_btn) return;
    if (
        expando_btn.classList.contains("image") ||
        expando_btn.classList.contains("video") ||
        expando_btn.classList.contains("video-muted")
    ) {
        postContainer.classList.add("imagePost");
    }
}

export default function setupExpandoButton(postContainer: HTMLDivElement) {
    const expando_btn =
        postContainer.querySelector<HTMLButtonElement>(".expando-button");
    if (!expando_btn) {
        return;
    }

    if (expando_btn.classList.contains("expanded")) {
        expando_btn.classList.add("need-to-collapse");
    }
    if (expando_btn.getAttribute("title") !== "Expando is not yet ready") {
        addImagePostClass(postContainer);
        return;
    }
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mu) => {
            if (mu.type === "attributes" && mu.attributeName === "class") {
                observer.disconnect();
                addImagePostClass(postContainer);
                return;
            }
        });
    });
    observer.observe(expando_btn, { attributes: true });
}
