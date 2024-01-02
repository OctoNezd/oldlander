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
    const buttons = (post.querySelector(".flat-list.buttons") as HTMLDivElement)
    const entry = post.querySelector(".entry")
    console.log(buttons, entry)
    if (post.dataset.type === "comment") {
        postContainer.insertBefore(buttons, entry!.nextSibling)
    } else {
        post.appendChild(buttons)
    }
    return postContainer;
}
