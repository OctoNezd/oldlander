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
    try {
        headerInner.appendChild(header.querySelector(".redditname"));
    } catch (e) {
        console.log("failed to move redditname");
    }
    document
        .querySelectorAll("#header-bottom-let-els")
        .forEach((el) => el.remove());
    header.appendChild(headerInner);
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

neuterSubredditCss();
setupHeader();
makeTabsDropDown();
document.body.classList.remove("with-listing-chooser");
