function setViewport() {
    const viewportCfg = document.createElement("meta");
    viewportCfg.setAttribute("name", "viewport");
    viewportCfg.setAttribute(
        "content",
        "width=device-width,initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    );
    document.head.appendChild(viewportCfg);
}
function makeTabsDropDown() {
    // remove old dropdowns if exist
    document
        .querySelectorAll(".tabmenudd")
        .forEach((el) => el.parentElement.removeChild(el));
    const header = document.getElementById("header-bottom-left-els");
    const tabsDropDown = document.createElement("select");
    tabsDropDown.classList.add("tabmenudd");
    for (const tab of document.querySelectorAll(".tabmenu li")) {
        const tabEl = document.createElement("option");
        if (tab.classList.contains("selected")) {
            tabEl.selected = true;
        }
        tabEl.innerText = tab.innerText;
        tabEl.setAttribute("value", tab.children[0].href);
        tabsDropDown.appendChild(tabEl);
    }
    header.appendChild(tabsDropDown);
    tabsDropDown.onchange = (e) => {
        location.href = tabsDropDown.value;
    };
    console.log("Dropdown initialized!");
}
function setupHeader() {
    const headerInner = document.createElement("div");
    headerInner.id = "header-bottom-left-els";
    const header = document.getElementById("header-bottom-left");
    header.appendChild(headerInner);
    try {
        headerInner.appendChild(header.querySelector(".redditname"));
    } catch (e) {
        console.log("failed to move redditname");
    }
}
function neuterSubredditCss() {
    try {
        document
            .querySelector("link[title=applied_subreddit_stylesheet]")
            .remove();
    } catch (e) {
        console.log("failed to remove subreddit stylesheet");
    }
}
function createSidebarEnabler() {
    const el = document.createElement("div");
    el.id = "sidebar-enable";
    el.classList.add("pagename");
    el.innerText = "<Open sidebar";
    return el;
}
const sidebarEnable = createSidebarEnabler();
function setupSidebar() {
    const sidebar = document.createElement("div");
    const sidebarHider = document.createElement("div");
    sidebarHider.innerText = "Hide sidebar";
    sidebarHider.id = "sidebar-hide";
    sidebarHider.classList.add("pagename");
    sidebar.id = "custom-sidebar";
    sidebar.appendChild(sidebarHider);
    document.body.appendChild(sidebarEnable);
    document.body.appendChild(sidebar);
    sidebar.appendChild(document.querySelector(".side"));
    const newSidebar = document.createElement("div");
    newSidebar.id = "custom-sidebar";
    sidebarEnable.onclick = () => sidebar.classList.add("active");
    sidebarHider.onclick = () => sidebar.classList.remove("active");
}
document.addEventListener("DOMContentLoaded", function onDOMContentLoaded() {
    setViewport();
    neuterSubredditCss();
    setupHeader();
    setupSidebar();
    makeTabsDropDown();
});
