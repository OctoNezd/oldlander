import "~/css/userSidebar.css";
import localforage from "localforage";

function createSidebarItem(text, link, icon, isActive) {
    const item = document.createElement("a");
    item.href = link;
    item.innerHTML = `<span class="material-symbols-outlined">forum</span>
                      <span class="sidebar-text">test</span>`;
    item.classList.add("sidebar-item");
    item.querySelector(".sidebar-text").innerText = text;
    if (icon === undefined || icon === null || icon === "") {
        icon = "forum";
    }
    if (icon.startsWith("http")) {
        item.querySelector(".material-symbols-outlined").remove();
        const img = document.createElement("img");
        img.src = icon;
        img.width = 40;
        img.height = 40;
        item.prepend(img);
    } else {
        item.querySelector(".material-symbols-outlined").innerText = icon;
    }
    if (isActive) {
        item.classList.add("sidebar-item-active");
        item.removeAttribute("href");
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
                    "merge",
                    multi.href === location.href
                )
            );
        }
    }
}
async function setupSubreddits(actualSidebar) {
    const age = parseInt(await localforage.getItem("subredditcache_age"));
    const now = Math.floor(Date.now() / 1000);
    const cached = JSON.parse(await localforage.getItem("subredditcache_act"));
    console.log(
        "cache test:",
        age + 60 * 60 < now,
        isNaN(age),
        cached === null
    );
    let subs = [];
    if (age + 60 * 60 < now || isNaN(age) || cached === null) {
        console.log("Updating subreddit cache");
        let after = "";
        let nodata = false;
        do {
            const { data } = await (
                await fetch(
                    `https://old.reddit.com/subreddits/mine.json?limit=100&after=${after}`,
                    {
                        credentials: "include",
                    }
                )
            ).json();
            if (data === undefined) {
                nodata = true;
                break;
            }
            after = data.after;
            subs = subs.concat(data.children);
            console.log("after:", after);
        } while (after);
        if (!nodata) {
            await localforage.setItem(
                "subredditcache_act",
                JSON.stringify(subs)
            );
            await localforage.setItem("subredditcache_age", now);
            console.log("Updated,", subs);
        }
    } else {
        subs = cached;
        console.log("Subreddit cache is up to date, created at", age, subs);
    }
    actualSidebar.appendChild(document.createElement("hr"));
    actualSidebar.appendChild(createSidebarSep("Subreddits"));
    actualSidebar.appendChild(
        createSidebarItem("Random", "/r/random", "shuffle", false)
    );
    actualSidebar.appendChild(
        createSidebarItem("Random NSFW", "/r/randnsfw", "18_up_rating", false)
    );
    for (const subreddit of subs) {
        actualSidebar.appendChild(
            createSidebarItem(
                subreddit.data.display_name,
                subreddit.data.url,
                subreddit.data.icon_img,
                location.pathname === subreddit.url
            )
        );
    }
}
function moveHeaderItems(actualSidebar) {
    const rheader = document.getElementById("header-bottom-right");
    const userlink = rheader.querySelector(".user a");
    if (userlink.innerText.includes("Log in")) {
        const loginitem = createSidebarItem(
            "Log in",
            "javascript:void(0)",
            "login",
            false
        );
        loginitem.addEventListener("click", () => {
            const rheader = document.getElementById("header-bottom-right");
            const userlink = rheader.querySelector(".user a");
            userlink.click();
        });
        actualSidebar.appendChild(loginitem);
        return;
    }
    actualSidebar.appendChild(
        createSidebarItem(
            userlink.text,
            userlink.href,
            "person",
            location.href === userlink.href
        )
    );
    const mail = document.getElementById("mail");
    let mailicon = "mark_email_unread";
    if (mail.classList.contains("nohavemail")) {
        mailicon = "mail";
    }
    actualSidebar.appendChild(
        createSidebarItem(
            "Messages",
            mail.href,
            mailicon,
            location.href === mail.href
        )
    );
    const prefslink = "https://old.reddit.com/prefs/";
    actualSidebar.appendChild(
        createSidebarItem(
            "Preferences",
            prefslink,
            "settings",
            location.href === prefslink
        )
    );
    if (document.body.classList.contains("res")) {
        actualSidebar.appendChild(
            createSidebarItem(
                "RES settings console",
                location.href + "#res:settings",
                "settings_applications",
                location.href === prefslink
            )
        );
    }
    const logoutItem = createSidebarItem(
        "Log out",
        "javascript:void(0)",
        "logout",
        false
    );
    logoutItem.onclick = () => {
        document.querySelector("form.logout a").click();
    };
    actualSidebar.appendChild(logoutItem);
}
export default function setupSidebar() {
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
    sb_open.classList.add("material-symbols-outlined");
    const sb_open_old = document.getElementById("user-sidebar-open");
    if (sb_open_old !== null) {
        sb_open_old.remove();
    }
    sb_open.id = "user-sidebar-open";
    sb_open.onclick = activeToggle;
    document.getElementById("ol-header").prepend(sb_open);

    const sb_close = document.createElement("div");
    sb_close.id = "user-sidebar-close";
    sb_close.onclick = activeToggle;
    sidebar.appendChild(sb_close);

    actualSidebar.appendChild(
        createSidebarItem("Homepage", "/", "home", location.pathname == "/")
    );

    actualSidebar.appendChild(document.createElement("hr"));
    moveHeaderItems(actualSidebar);

    setupMultireddits(actualSidebar);
    setupSubreddits(actualSidebar);
    return [activeToggle, sidebar];
}
