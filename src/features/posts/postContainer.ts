import "./css/postContainer.css";
export default function setupPostContainer(post: HTMLDivElement) {
    // create new postContainer div to hold post & expando preview
    const postContainer = document.createElement("div");
    const filteredChildren: Array<Element> = [];
    for (let child of post.children) {
        if (!child.classList.contains("midcol")) {
            filteredChildren.push(child);
        }
    }
    postContainer.append(...filteredChildren);
    Object.assign(postContainer.dataset, post.dataset);
    postContainer.classList.add("ol-post-container");
    post.appendChild(postContainer);
    const buttons = post.querySelector(".flat-list.buttons") as HTMLDivElement;
    const entry = post.querySelector(".entry");
    if (post.dataset.type === "comment") {
        postContainer.insertBefore(buttons, entry!.nextSibling);
    } else {
        post.appendChild(buttons);
    }
    return postContainer;
}
