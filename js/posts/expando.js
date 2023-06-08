export default function (post) {
    const expando_btn = post.querySelector(".expando-button");
    console.log(expando_btn.classList);
    if (
        expando_btn.classList.contains("image") ||
        expando_btn.classList.contains("video")
    ) {
        post.classList.add("imagePost");
    }
}
