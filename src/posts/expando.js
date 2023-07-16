function setupInitializedExpando(post, expando) {
    post.after(expando);
    const expando_btn = post.querySelector(".expando-button");
    if (expando_btn.classList.contains("need-to-collapse")) {
        expando_btn.classList.remove("need-to-collapse");
        expando_btn.click();
    }
    expando.classList.remove("hidden");
}

export default function setupExpando(post) {
    const expando = post.querySelector(".expando");
    if (!expando) {
        return;
    }

    expando.classList.add("hidden"); // hide the expando until we are able to collapse it
    if (!expando.classList.contains("expando-uninitialized")) {
        setupInitializedExpando(post, expando);
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
                setupInitializedExpando(post, expando);
                return;
            }
        });
    });
    observer.observe(expando, { attributes: true });
}
