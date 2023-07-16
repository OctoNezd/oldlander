import { waitForElement } from "./waitForElement";

export default function querySelectorAsync<T extends HTMLElement>(selector: string) {
    return new Promise<T>((resolve, _reject) => {
        waitForElement<T>(selector, resolve);
    });
}
