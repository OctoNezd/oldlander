import "~/css/header.css";
import modal from "./modal";
import querySelectorAsync from "./utility/querySelectorAsync";

async function createHeader() {
    const oldheader = document.getElementById("ol-header");
    if (oldheader != null) {
        oldheader.remove();
    }
    const header = document.createElement("div");
    header.id = "ol-header";
    const body = await querySelectorAsync("body");
    body.insertBefore(header, await querySelectorAsync("#header"));
    header.innerHTML = `<div class="sr-info">
                            <p class="subreddit-name"></p>
                            <p class="sort-mode"></p>
                        </div>
                        <span class="aux-buttons"></span>`;
    const pageName = document.querySelector(".pagename");
    header.querySelector(".subreddit-name").innerText =
        pageName === null ? "Homepage" : pageName.innerText;

    let prevScrollPos = window.scrollY;
    let animInProgress = false;
    function onScroll() {
        const currentScrollPos = window.scrollY;
        if (!animInProgress) {
            if (prevScrollPos > currentScrollPos) {
                // user has scrolled up
                let playAnim = true;
                if (header.classList.contains("stick")) {
                    playAnim = false;
                }
                header.classList.add("stick");
                if (playAnim) {
                    animInProgress = true;
                    header
                        .animate([{ top: "-48px" }, { top: 0 }], {
                            fill: "forwards",
                            duration: 250,
                        })
                        .addEventListener("finish", function () {
                            animInProgress = false;
                        });
                }
            } else if (header.classList.contains("stick")) {
                // user has scrolled down
                animInProgress = true;
                header
                    .animate([{ top: "0" }, { top: "-48px" }], {
                        fill: "forwards",
                        duration: 250,
                    })
                    .addEventListener("finish", function () {
                        header.classList.remove("stick");
                        animInProgress = false;
                    });
            }
        }
        // update previous scroll position
        prevScrollPos = currentScrollPos;
    }
    window.addEventListener("scroll", onScroll);

    return header;
}

function makeSortSelector(header) {
    // remove old selectors if exist
    document
        .querySelectorAll("#sortsel")
        .forEach((el) => el.parentElement.removeChild(el));

    const options = {};
    for (const tab of document.querySelectorAll(".tabmenu li")) {
        if (
            tab.innerText === "" ||
            tab.innerText.includes("show images") ||
            !tab.innerText.trim().length
        ) {
            continue;
        }
        let itemtext = tab.innerText[0].toUpperCase() + tab.innerText.slice(1);
        options[itemtext] = tab.children[0].href;
        if (tab.classList.contains("selected")) {
            header.querySelector(".sort-mode").innerText = tab.innerText;
        }
    }
    if (Object.keys(options).length <= 1) {
        return;
    }
    const optionmenu = document.createElement("ul");
    for (const [option_text, option_link] of Object.entries(options)) {
        const optel = document.createElement("li");
        const optel_link = document.createElement("a");
        optel_link.classList.add("sortmodeselector");
        optel_link.href = option_link;
        optel_link.innerText = option_text;
        optel.appendChild(optel_link);
        optionmenu.appendChild(optel);
    }
    const btn = document.createElement("button");
    btn.id = "sortsel";
    btn.classList.add("material-symbols-outlined");
    btn.innerText = "sort";
    header.querySelector(".aux-buttons").appendChild(btn);
    btn.onclick = () => {
        modal("Sort mode", optionmenu, () => {});
    };
}

function addSubSidebarButton(header) {
    const btn = document.createElement("button");
    btn.innerText = "info";
    btn.classList.add("material-symbols-outlined");
    btn.onclick = () => {
        const evt = new Event("toggleSub");
        document.dispatchEvent(evt);
    };
    header.querySelector(".aux-buttons").appendChild(btn);
}
function addUserSidebarButton(header) {
    const btn = document.createElement("button");
    btn.innerText = "menu";
    btn.classList.add("material-symbols-outlined");
    btn.id = "user-sidebar-open";
    btn.onclick = () => {
        const evt = new Event("toggleUser");
        document.dispatchEvent(evt);
    };
    header.prepend(btn);
}

async function setupOldLanderHeader() {
    const header = await createHeader();
    makeSortSelector(header);
    addSubSidebarButton(header);
    addUserSidebarButton(header);
}

setupOldLanderHeader();
