function setupGenericToggle(post, selector, onval) {
    const button = post.querySelector(selector);
    if (button === null) {
        console.error("Failed to find", selector, "skipping");
        return;
    }
    let lastState = button.innerText.includes(onval);
    function setToggleClass() {
        if (lastState) {
            button.classList.add("on");
        } else {
            button.classList.remove("on");
        }
    }
    setToggleClass();
    button.addEventListener("click", () => {
        console.log("updating state");
        lastState = !lastState;
        setToggleClass();
    });
}
export default function setupToggles(post) {
    setupGenericToggle(post, ".save-button a", "unsave");
    setupGenericToggle(post, ".hide-button a", "unhide");
}
