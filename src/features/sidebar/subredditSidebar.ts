import "./css/subredditSidebar.css";
import querySelectorAsync from "../../utility/querySelectorAsync";
import buildSidebar from "./buildSidebar";

export default async function buildSubredditSidebar() {
    const actualSidebar = await querySelectorAsync<HTMLDivElement>(
        "body > .side"
    );
    actualSidebar.remove();

    const { sidebar: sidebar, activeToggle: activeToggle } = buildSidebar(
        actualSidebar,
        "custom-sidebar",
        "custom-sidebar-close",
        false
    );

    document.body.appendChild(sidebar);
    return { sidebar: sidebar, activeToggle: activeToggle };
}
