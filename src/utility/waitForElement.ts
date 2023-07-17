export function waitForElement<T extends HTMLElement>(
    selector: string,
    callback: (element: T) => void
) {
    // see if element exists already
    const element = document.querySelector<T>(selector);
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
                        document.querySelector<T>(selector);
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

export function waitForAllElements<T extends HTMLElement>(
    selector: string,
    callback: (element: T) => void
) {
    // perform callback on already existing elements
    for (const element of document.querySelectorAll<T>(selector)) {
        callback(element);
    }
    // then set up an observer
    var observer = new MutationObserver(function (mutations) {
        const foundElements = new Set<T>();
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node instanceof HTMLElement) {
                    if (node.matches(selector)) {
                        foundElements.add(node as T);
                    }
                    for (const element of node.querySelectorAll<T>(
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
