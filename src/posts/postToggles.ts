function setupGenericToggle(
    post: HTMLDivElement,
    buttonSelector: string,
    onValue: string
) {
    const button = post.querySelector<HTMLButtonElement>(buttonSelector);
    if (!button) {
        return;
    }

    let lastState = button.innerText.includes(onValue);
    function setToggleClass(button: HTMLButtonElement) {
        if (lastState) {
            button.classList.add("on");
        } else {
            button.classList.remove("on");
        }
    }

    setToggleClass(button);
    button.addEventListener("click", () => {
        lastState = !lastState;
        setToggleClass(button);
    });
}
export default function setupToggles(post: HTMLDivElement) {
    setupGenericToggle(post, ".save-button a", "unsave");
    setupGenericToggle(post, ".hide-button a", "unhide");
}
