export default function insertStyle(style) {
    var element = document.createElement("style");
    element.classList.add("ol-style");
    element.innerText = style;
    if (document.head) {
        document.head.appendChild(element);
        return;
    }
    var observer = new MutationObserver(function () {
        if (document.head) {
            observer.disconnect();
            document.head.appendChild(element);
        }
    });
    observer.observe(document.documentElement, {
        childList: true,
    });
}
