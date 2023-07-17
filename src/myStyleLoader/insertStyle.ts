export default function insertStyle(style: any) {
    const element = document.createElement("style");
    element.classList.add("ol-style");
    element.innerText = style.toString();
    if (document.head) {
        document.head.appendChild(element);
        return;
    }
    const observer = new MutationObserver(function () {
        if (document.head) {
            observer.disconnect();
            document.head.appendChild(element);
        }
    });
    observer.observe(document.documentElement, {
        childList: true,
    });
}
