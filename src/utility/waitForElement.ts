export function waitForElement(
    selector: string,
    callback: (element: HTMLElement) => void
) {
    // see if element exists already
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
        callback(element);
        return;
    }
    // otherwise set up an observer
    var observer = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node instanceof HTMLElement) {
                    // new nodes have been added, check them
                    const element =
                        document.querySelector<HTMLElement>(selector);
                    if (element) {
                        observer.disconnect();
                        callback(element);
                    }
                    return;
                }
            }
        }
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
}

export function waitForAllElements(
    selector: string,
    callback: (element: HTMLElement) => void
) {
    // perform callback on already existing elements
    for (const element of document.querySelectorAll<HTMLElement>(selector)) {
        callback(element);
    }
    // then set up an observer
    var observer = new MutationObserver(function (mutations) {
        const foundElements = new Set<HTMLElement>();
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node instanceof HTMLElement) {
                    if (node.matches(selector)) {
                        foundElements.add(node);
                    }
                    for (const element of node.querySelectorAll<HTMLElement>(
                        selector
                    )) {
                        foundElements.add(element);
                    }
                }
            }
        }
        for (const element of foundElements) {
            callback(element);
        }
    });
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
}
