function setViewport() {
    const viewportCfg = document.createElement("meta");
    viewportCfg.setAttribute("name", "viewport");
    viewportCfg.setAttribute(
        "content",
        "width=device-width,initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    );
    document.head.appendChild(viewportCfg);
}
// https://stackoverflow.com/questions/26324624/wait-for-document-body-existence
(function () {
    "use strict";

    var observer = new MutationObserver(function () {
        if (document.head) {
            // It exists now
            setViewport();
            observer.disconnect();
        }
    });
    observer.observe(document.documentElement, { childList: true });
})();
document.addEventListener("DOMContentLoaded", function onDOMContentLoaded() {
    setViewport();
});
