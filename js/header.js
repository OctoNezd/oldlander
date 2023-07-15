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
    let headerTop = -48;
    function onScroll() {
        const currentScrollPos = window.scrollY;
        if (window.scrollY <= 48) {
            header.classList.remove("fixed");
            return;
        } else {
            header.classList.add("fixed");
        }
        headerTop = headerTop + prevScrollPos - currentScrollPos;
        if (headerTop > 0) {
            headerTop = 0;
        }
        if (headerTop < -48) {
            headerTop = -48;
        }
        header.style.top = headerTop + "px";
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
    querySelectorAsync("#custom-sidebar").then(
        async () => await addSubSidebarButton(header)
    );
    addUserSidebarButton(header);
}

setupOldLanderHeader();
