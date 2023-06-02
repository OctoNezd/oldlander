// Put all the javascript code here, that you want to execute after page load.
function setViewport() {
    const viewportCfg = document.createElement("meta");
    viewportCfg.setAttribute("name", "viewport");
    viewportCfg.setAttribute("content", "width=device-width,initial-scale=1");
    document.head.appendChild(viewportCfg);
}
setViewport();
