import "~/css/user_sidebar.css";

function setup_user_sidebar() {
    if (!document.body.classList.contains("with-listing-chooser")) {
        console.error(
            "Couldn't find listing chooser selector - probably not logged in."
        );
        return;
    }
    document.body.classList.remove(
        "listing-chooser-collapsed",
        "with-listing-chooser"
    );
    const sidebar = document.querySelector(".listing-chooser.initialized");
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
    const actualSidebar = sidebar.querySelector(".contents");
    actualSidebar.classList.add("side");
    actualSidebar.addEventListener("animationend", () => {
        console.log("Animation ended", sidebar.classList);
        if (sidebar.classList.contains("abouttodie")) {
            sidebar.classList.remove("active");
        }
        sidebar.classList.remove("showingup", "abouttodie");
    });
    const sb_open = document.createElement("button");
    sb_open.id = "user-sidebar-open";
    sb_open.onclick = activeToggle;
    document.getElementById("header-bottom-left").prepend(sb_open);

    const sb_close = document.createElement("div");
    sb_close.id = "user-sidebar-close";
    sb_close.onclick = activeToggle;
    sidebar.appendChild(sb_close);
}
setup_user_sidebar();
