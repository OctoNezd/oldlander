import querySelectorAsync from "../utility/querySelectorAsync";
import { OLFeature } from "./base";
function replaceSubdomain(url: string, toSubdomain: string) {
    const replace = "://" + toSubdomain + ".";

    // Prepend http://
    if (!/^\w*:\/\//.test(url)) {
        url = "http://" + url;
    }

    // Check if we got a subdomain in url
    if (url.match(/\.\w*\b/g)!.length > 1) {
        return url.replace(/(:\/\/\w+\.)/, replace);
    }

    return url.replace(/:\/\/(\w*\.)/, `${replace}$1`);
}

export default class RedesignRedirect extends OLFeature {
    moduleId = "redesignRedirect";
    moduleName = "RedesignRedirect";
    async init() {
        await querySelectorAsync("body");
        if (!document.documentElement.classList.contains("js")) {
            document.documentElement.classList.add("new-reddit");
            const goToOldReddit = document.createElement("a");
            goToOldReddit.classList.add("switch-to-good-reddit");
            goToOldReddit.innerText = "Go to old reddit";
            console.log("swt", replaceSubdomain(window.location.href, "old"));
            goToOldReddit.href = replaceSubdomain(window.location.href, "old");
            document.body.appendChild(goToOldReddit);
        }
    }
}
