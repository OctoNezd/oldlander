import { waitForElement } from "./waitForElement";

export default function querySelectorAsync(selector) {
    return new Promise((resolve, _reject) => {
        waitForElement(selector, resolve);
    });
}
