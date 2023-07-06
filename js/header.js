import "~/css/header.css";
import modal from "./modal";
function makeSortSelector() {
    // remove old selectors if exist
    document
        .querySelectorAll("#sortsel")
        .forEach((el) => el.parentElement.removeChild(el));
    const options = {};
    const header = document.querySelector("#ol-header");

    for (const tab of document.querySelectorAll(".tabmenu li")) {
        if (
            tab.innerText === "" ||
            tab.innerText.includes("show images") ||
            !tab.innerText.trim().length
        ) {
            continue;
        }
        console.log(tab.innerText);
        let itemtext = tab.innerText[0].toUpperCase() + tab.innerText.slice(1);
        options[itemtext] = tab.children[0].href;
        if (tab.classList.contains("selected")) {
            header.querySelector(".sort-mode").innerText = tab.innerText;
        }
    }
    if (options.length <= 1) {
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
function setupOldLanderHeader() {
    const oldheader = document.getElementById("ol-header");
    if (oldheader != null) {
        oldheader.remove();
    }
    const header = document.createElement("div");
    header.id = "ol-header";
    document.body.insertBefore(header, document.getElementById("header"));
    header.innerHTML = `<div class="sr-info">
                            <p class="subreddit-name"></p>
                            <p class="sort-mode"></p>
                        </div>
                        <span class="aux-buttons"></span>`;
    const pageName = document.querySelector(".pagename");
    header.querySelector(".subreddit-name").innerText =
        pageName === null ? "Homepage" : pageName.innerText;

    let prevScrollPos = window.scrollY;

    window.addEventListener("scroll", function () {
        // current scroll position
        const currentScrollPos = window.scrollY;

        if (prevScrollPos > currentScrollPos) {
            // user has scrolled up
            let playAnim = true;
            if (header.classList.contains("stick")) {
                playAnim = false;
            }
            header.classList.add("stick");
            if (playAnim) {
                header.animate([{ top: "-48px" }, { top: 0 }], {
                    fill: "forwards",
                    duration: 250,
                });
            }
        } else {
            // user has scrolled down
            header
                .animate([{ top: "0" }, { top: "-48px" }], {
                    fill: "forwards",
                    duration: 250,
                })
                .addEventListener("finish", function () {
                    header.classList.remove("stick");
                });
        }

        // update previous scroll position
        prevScrollPos = currentScrollPos;
    });
    return header;
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
function addUserSidebarButton(header){
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

const header = setupOldLanderHeader();
makeSortSelector();
addSubSidebarButton(header);
addUserSidebarButton(header);
