export default function setupPostContainer(post: HTMLDivElement) {
    // create new postContainer div to hold post & expando preview
    const postContainer = document.createElement("div");
    postContainer.append(...post.children)
    Object.assign(postContainer.dataset, post.dataset)
    postContainer.classList.add("ol-post-container");
    // const clearLeft = post.nextElementSibling; // i don't know what this div is but let's put it inside too
    // post.before(postContainer);
    // postContainer.appendChild(post);
    // if (clearLeft) {
        // postContainer.appendChild(clearLeft);
    // }
    post.appendChild(postContainer);
    post.insertBefore((post.querySelector(".flat-list.buttons") as HTMLDivElement), post.querySelector(".entry"))
    return postContainer;
}
