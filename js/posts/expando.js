export function addImagePostClass(post) {
    const expando_btn = post.querySelector(".expando-button");
    if (
        expando_btn.classList.contains("image") ||
        expando_btn.classList.contains("video")
    ) {
        post.classList.add("imagePost");
    }
}

export function moveExpandoOutsidePost(post) {
    const expando = post.querySelector(".expando");
    if (!expando) {
        return;
    }

    if (!expando.classList.contains("expando-uninitialized")) {
        post.after(expando);
        return;
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mu) => {
            if (
                mu.type === "attributes" &&
                mu.attributeName === "class" &&
                !expando.classList.contains("expando-uninitialized")
            ) {
                observer.disconnect();
                post.after(expando);
                return;
            }
        });
    });
    observer.observe(expando, { attributes: true });
}
