import "./css/subredditSidebar.css";
import querySelectorAsync from "../utility/querySelectorAsync";
import buildSidebar from "./buildSidebar";

export default async function buildSubredditSidebar() {
    const body = await querySelectorAsync("body");
    const actualSidebar = await querySelectorAsync("body > .side");
    actualSidebar.remove();

    const [activeToggle, sidebar] = buildSidebar(
        actualSidebar,
        "custom-sidebar",
        "custom-sidebar-close",
        false
    );

    body.appendChild(sidebar);
    return [activeToggle, sidebar];
}
