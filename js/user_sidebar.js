import "~/css/user_sidebar.css";

function createSidebarItem(text, link, icon, isActive) {
    const item = document.createElement("a");
    item.href = link;
    item.innerHTML = `<i class=""></i>
                      <span class="sidebar-text">test</span>`;
    item.classList.add("sidebar-item");
    item.querySelector(".sidebar-text").innerText = text;
    item.querySelector("i").classList.add(...icon);
    if (isActive) {
        item.classList.add("sidebar-item-active");
    }
    return item;
}
function createSidebarSep(text) {
    const item = document.createElement("p");
    item.innerText = text;
    item.classList.add("sidebar-headline");
    return item;
}
function setupMultireddits(actualSidebar) {
    const multis = document.querySelectorAll(
        '.multis > li > a:not([href="/r/multihub/"])'
    );
    console.log(multis);
    if (multis.length > 0) {
        actualSidebar.appendChild(document.createElement("hr"));
        actualSidebar.appendChild(createSidebarSep("Multireddits"));
        for (const multi of multis) {
            actualSidebar.appendChild(
                createSidebarItem(
                    multi.innerText,
                    multi.href,
                    ["fa-solid", "fa-comments"],
                    multi.href === location.href
                )
            );
        }
    }
}
function setupSubreddits(actualSidebar) {
    actualSidebar.appendChild(document.createElement("hr"));
    actualSidebar.appendChild(createSidebarSep("Subreddits"));
    for (const subreddit of document.querySelectorAll(
        ".drop-choices.srdrop > .choice"
    )) {
        actualSidebar.appendChild(
            createSidebarItem(
                subreddit.text,
                subreddit.href,
                ["fa-solid", "fa-message"],
                location.href === subreddit.href
            )
        );
    }
}
function setupSidebar() {
    document.body.classList.remove("with-listing-chooser");
    const sidebar = document.createElement("div");
    const old_sidebar = document.getElementById("user_sidebar");
    if (old_sidebar !== null) {
        old_sidebar.remove();
    }
    document.body.appendChild(sidebar);
    sidebar.id = "user-sidebar";
    function activeToggle(e) {
        console.log("AT");
        if (e !== undefined) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (sidebar.classList.contains("active")) {
            sidebar.classList.add("abouttodie");
        } else {
            sidebar.classList.add("active", "showingup");
        }
    }
    const actualSidebar = document.createElement("div");
    actualSidebar.innerHTML = `<p class="sidebar-apptitle">🛸 OldLander</p>`;
    sidebar.appendChild(actualSidebar);
    actualSidebar.classList.add("side", "surface");
    actualSidebar.addEventListener("animationend", () => {
        console.log("Animation ended", sidebar.classList);
        if (sidebar.classList.contains("abouttodie")) {
            sidebar.classList.remove("active");
        }
        sidebar.classList.remove("showingup", "abouttodie");
    });
    const sb_open = document.createElement("button");
    const sb_open_old = document.getElementById("user-sidebar-open");
    if (sb_open_old !== null) {
        sb_open_old.remove();
    }
    sb_open.id = "user-sidebar-open";
    sb_open.onclick = activeToggle;
    document.getElementById("header-bottom-left").prepend(sb_open);

    const sb_close = document.createElement("div");
    sb_close.id = "user-sidebar-close";
    sb_close.onclick = activeToggle;
    sidebar.appendChild(sb_close);
    actualSidebar.appendChild(
        createSidebarItem(
            "Homepage",
            "/",
            ["fa-solid", "fa-house"],
            location.pathname == "/"
        )
    );
    setupMultireddits(actualSidebar);
    setupSubreddits(actualSidebar);
}
setupSidebar();
