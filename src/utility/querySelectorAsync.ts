import { waitForElement } from "./waitForElement";

export default function querySelectorAsync(selector: string) {
    return new Promise<HTMLElement>((resolve, _reject) => {
        waitForElement(selector, resolve);
    });
}
