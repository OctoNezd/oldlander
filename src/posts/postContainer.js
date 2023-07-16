export default function setupPostContainer(post) {
    // create new postContainer div to hold post & expando preview
    const postContainer = document.createElement("div");
    postContainer.classList.add("ol-post-container");
    const clearLeft = post.nextElementSibling; // i don't know what this div is but let's put it inside too
    post.before(postContainer);
    postContainer.appendChild(post);
    if (clearLeft) {
        postContainer.appendChild(clearLeft);
    }
    
    return postContainer;
}
