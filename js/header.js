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
    // const tabsDropDown = document.createElement("select");
    // tabsDropDown.classList.add("tabmenudd");

    // document.querySelector("#ol-header .sort-mode").innerText =
    //     tabsDropDown[tabsDropDown.selectedIndex].innerText;
    // if (tabsDropDown.options.length === 1) {
    //     return;
    // }
    // header.appendChild(tabsDropDown);
    // tabsDropDown.onchange = (e) => {
    //     location.href = tabsDropDown.value;
    // };
    // console.log("Dropdown initialized!");
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
        pageName === null ? "Homepage" : pageName;
}
setupOldLanderHeader();
makeSortSelector();
