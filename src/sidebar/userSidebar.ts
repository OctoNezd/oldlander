import "./css/userSidebar.css";
import localforage from "localforage";
import querySelectorAsync from "../utility/querySelectorAsync";
import buildSidebar from "./buildSidebar";

function createSidebarItem(
    text: string,
    link: string,
    icon: string,
    isActive: boolean,
    cls?: string
) {
    const item = document.createElement("a");
    if (cls !== undefined) {
        item.classList.add(cls);
    }
    item.href = link;
    item.classList.add("sidebar-item");

    if (icon.startsWith("http")) {
        const img = document.createElement("img");
        img.src = icon;
        img.width = 40;
        img.height = 40;
        item.prepend(img);
    } else {
        const iconEl = document.createElement("span");
        iconEl.classList.add("material-symbols-outlined");
        iconEl.innerText = icon || "forum";
        item.appendChild(iconEl);
    }

    const labelEl = document.createElement("span");
    labelEl.classList.add("sidebar-text");
    labelEl.innerText = text;
    item.appendChild(labelEl);

    if (isActive) {
        item.classList.add("sidebar-item-active");
        item.removeAttribute("href");
    }
    return item;
}

function createSidebarSubheading(
    text: string,
    button?: HTMLButtonElement
) {
    const item = document.createElement("p");
    const textEl = document.createElement("span");
    textEl.innerText = text;
    item.appendChild(textEl);
    item.classList.add("sidebar-headline");
    if (button) {
        item.appendChild(button);
    }
    return item;
}

async function setupMultireddits(parentContainer:HTMLDivElement) {
    await querySelectorAsync(".multis");
    const multis = document.querySelectorAll<HTMLAnchorElement>(
        '.multis > li > a:not([href="/r/multihub/"])'
    );
    if (multis.length > 0) {
        parentContainer.appendChild(document.createElement("hr"));
        parentContainer.appendChild(createSidebarSubheading("Multireddits"));
        for (const multi of multis) {
            parentContainer.appendChild(
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

async function setupSubreddits(parentContainer:HTMLDivElement) {
    const age = parseInt(await localforage.getItem("subredditcache_age"));
    const now = Math.floor(Date.now() / 1000);
    const cached = JSON.parse(await localforage.getItem("subredditcache_act"));
    let subs = [];
    const container = document.createElement("span");
    container.id = "oldlander-subredditlist";
    const refreshButton = document.createElement("button");
    refreshButton.classList.add("material-symbols-outlined");
    refreshButton.innerText = "refresh";
    const refreshHandler = () => {
        refreshButton.removeEventListener("click", refreshHandler);
        console.log("refresh");
        refreshButton.classList.add("spin");
        setupSubreddits(parentContainer);
    };
    refreshButton.addEventListener("click", refreshHandler);

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
    container.appendChild(document.createElement("hr"));
    container.appendChild(createSidebarSubheading("Subreddits", refreshButton));
    container.appendChild(
        createSidebarItem(
            "Random",
            "/r/random",
            "shuffle",
            false,
            "oldlander-subreddit"
        )
    );
    container.appendChild(
        createSidebarItem(
            "Random NSFW",
            "/r/randnsfw",
            "18_up_rating",
            false,
            "oldlander-subreddit"
        )
    );
    for (const subreddit of subs) {
        container.appendChild(
            createSidebarItem(
                subreddit.data.display_name,
                subreddit.data.url,
                subreddit.data.icon_img,
                location.pathname === subreddit.url,
                "oldlander-subreddit"
            )
        );
    }
    document
        .querySelectorAll("#oldlander-subredditlist")
        .forEach((el) => el.remove());
    parentContainer.appendChild(container);
}

async function buildHeaderItems(parentContainer:HTMLDivElement) {
    const rheader = await querySelectorAsync("#header-bottom-right");

    parentContainer.appendChild(document.createElement("hr"));
    if (document.body.classList.contains("res")) {
        const prefurl = new URL(location.toString());
        prefurl.hash = "res:settings";
        parentContainer.appendChild(
            createSidebarItem(
                "RES settings console",
                prefurl.toString(),
                "settings_applications",
                false
            )
        );
    }
    const prefurl = new URL(location.toString());
    prefurl.hash = "olPreferences";
    parentContainer.appendChild(
        createSidebarItem(
            "OldLander preferences",
            prefurl.toString(),
            "build_circle",
            false
        )
    );
    const userlink = rheader.querySelector<HTMLAnchorElement>(".user a");
    if (userlink.innerText.includes("Log in")) {
        const loginitem = createSidebarItem(
            "Log in",
            "javascript:void(0)",
            "login",
            false
        );
        loginitem.addEventListener("click", () => {
            userlink.click();
        });
        parentContainer.appendChild(loginitem);
        return;
    }

    parentContainer.appendChild(
        createSidebarItem(
            userlink.text,
            userlink.href,
            "person",
            location.href === userlink.href
        )
    );
    const mail = rheader.querySelector<HTMLAnchorElement>("#mail");
    let mailicon = mail.classList.contains("nohavemail")
        ? "mail"
        : "mark_email_unread";
    parentContainer.appendChild(
        createSidebarItem(
            "Messages",
            mail.href,
            mailicon,
            location.href === mail.href
        )
    );
    const prefslink = "https://old.reddit.com/prefs/";
    parentContainer.appendChild(
        createSidebarItem(
            "Preferences",
            prefslink,
            "settings",
            location.href === prefslink
        )
    );

    const logoutItem = createSidebarItem(
        "Log out",
        "javascript:void(0)",
        "logout",
        false
    );
    logoutItem.onclick = () => {
        rheader.querySelector<HTMLAnchorElement>("form.logout a").click();
    };
    parentContainer.appendChild(logoutItem);
}

export default async function buildUserSidebar() {
    const body = await querySelectorAsync("body");
    body.classList.remove("with-listing-chooser");

    const innerSidebar = document.createElement("div");
    const { sidebar: sidebar, activeToggle: activeToggle } = buildSidebar(
        innerSidebar,
        "user-sidebar",
        "user-sidebar-close",
        true
    );

    innerSidebar.innerHTML = `<p class="sidebar-apptitle">🛸 OldLander</p>`;
    innerSidebar.classList.add("side");
    innerSidebar.appendChild(
        createSidebarItem("Homepage", "/", "home", location.pathname == "/")
    );

    const headerItems = document.createElement("div");
    innerSidebar.appendChild(headerItems);
    const multireddits = document.createElement("div");
    innerSidebar.appendChild(multireddits);
    const subreddits = document.createElement("div");
    innerSidebar.appendChild(subreddits);

    // do not await, let the items load in in their own time
    buildHeaderItems(headerItems);
    setupMultireddits(multireddits);
    setupSubreddits(subreddits);

    body.appendChild(sidebar);
    return { sidebar: sidebar, activeToggle: activeToggle };
}
