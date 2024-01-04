import { waitForAllElements } from "../../utility/waitForElement";

function setupGenericToggle(
    buttonSelector: string,
    onValue: string
) {
    waitForAllElements(buttonSelector, (button: HTMLButtonElement) => {
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
    })
}

export default function setupToggles() {
    setupGenericToggle(".save-button a", "unsave");
    setupGenericToggle(".hide-button a", "unhide");
}
