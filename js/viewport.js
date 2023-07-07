import querySelectorAsync from "./utility/querySelectorAsync";

async function setViewport() {
    const viewportElement = await querySelectorAsync('head > meta[name="viewport"]');
    viewportElement.setAttribute(
        "content",
        "width=device-width,initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    );
}

setViewport();
