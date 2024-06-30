import "./css/subredditSidebar.css";
import querySelectorAsync from "../../utility/querySelectorAsync";
import buildSidebar from "./buildSidebar";

export default async function buildSubredditSidebar() {
    let actualSidebar;
    if (
        location.pathname === "/prefs/" ||
        location.pathname.includes("/message/")
    ) {
        // actualSidebar = document.createElement("div");
        // actualSidebar.classList.add("side");
        // await querySelectorAsync("body");
        return {
            sidebar: undefined,
            activeToggle: () => {},
        };
    } else {
        actualSidebar = await querySelectorAsync<HTMLDivElement>(
            "body > .side"
        );
        actualSidebar.remove();
    }

    const { sidebar: sidebar, activeToggle: activeToggle } = buildSidebar(
        actualSidebar,
        "custom-sidebar",
        "custom-sidebar-close",
        false
    );

    document.body.appendChild(sidebar);
    return { sidebar: sidebar, activeToggle: activeToggle };
}
