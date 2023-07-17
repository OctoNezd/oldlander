import "./header.css";
import modal from "../modal";
import querySelectorAsync from "../utility/querySelectorAsync";

async function createHeader() {
    const oldheader = document.getElementById("ol-header");
    if (oldheader != null) {
        oldheader.remove();
    }
    const header = document.createElement("div");
    header.id = "ol-header";
    const redditHeader = await querySelectorAsync("#header");
    redditHeader.before(header);
    header.innerHTML = `<div class="sr-info">
                            <p class="subreddit-name"></p>
                            <p class="sort-mode"></p>
                        </div>
                        <span class="aux-buttons"></span>`;
    const pageName = document.querySelector<HTMLElement>(".pagename");
    header.querySelector<HTMLElement>(".subreddit-name")!.innerText =
        pageName === null ? "Homepage" : pageName.innerText;

    let prevScrollPos = window.scrollY;
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
        header.style.top = `${headerTop}px`;
        // update previous scroll position
        prevScrollPos = currentScrollPos;
    }
    window.addEventListener("scroll", onScroll);

    return header;
}

function makeSortSelector(header: HTMLDivElement) {
    // remove old selectors if exist
    document.querySelectorAll("#sortsel").forEach((el) => el.remove());

    const options: { [id: string]: string } = {};
    for (const tab of document.querySelectorAll<HTMLLIElement>(".tabmenu li")) {
        if (
            tab.innerText === "" ||
            tab.innerText.includes("show images") ||
            !tab.innerText.trim().length
        ) {
            continue;
        }
        const itemLink = tab.firstElementChild;
        if (!(itemLink instanceof HTMLAnchorElement)) {
            continue;
        }
        const itemtext =
            tab.innerText[0].toUpperCase() + tab.innerText.slice(1);
        options[itemtext] = itemLink.href;
        if (tab.classList.contains("selected")) {
            header.querySelector<HTMLElement>(".sort-mode")!.innerText =
                tab.innerText;
        }
    }
    if (Object.keys(options).length <= 1) {
        return;
    }
    const optionmenu = document.createElement("ul");
    for (const [option_text, option_link] of Object.entries(options)) {
        const optEl = document.createElement("li");
        const optElLink = document.createElement("a");
        optElLink.classList.add("sortmodeselector");
        optElLink.href = option_link;
        optElLink.innerText = option_text;
        optEl.appendChild(optElLink);
        optionmenu.appendChild(optEl);
    }
    const btn = document.createElement("button");
    btn.id = "sortsel";
    btn.classList.add("material-symbols-outlined");
    btn.innerText = "sort";
    header.querySelector(".aux-buttons")!.appendChild(btn);
    btn.onclick = () => {
        modal("Sort mode", optionmenu, null);
    };
}

async function addSubSidebarButton(header: HTMLDivElement) {
    await querySelectorAsync("#custom-sidebar");

    const btn = document.createElement("button");
    btn.innerText = "info";
    btn.classList.add("material-symbols-outlined");
    btn.onclick = () => {
        const evt = new Event("toggleSub");
        document.dispatchEvent(evt);
    };
    header.querySelector(".aux-buttons")!.appendChild(btn);
}

function addUserSidebarButton(header: HTMLDivElement) {
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
    addSubSidebarButton(header); // don't await this, it won't finish if there is no subreddit sidebar
    addUserSidebarButton(header);
}

setupOldLanderHeader();
