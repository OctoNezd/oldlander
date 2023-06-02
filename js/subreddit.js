function parseSubreddit() {
    return location.href.split("/")[4];
}
const subreddit = parseSubreddit();
console.log("subreddit is", subreddit);
function fetchSubredditLogo() {
    fetch(`https://old.reddit.com/r/${subreddit}/about.json`)
        .then((response) => response.json())
        .then((data) => {
            console.log("about.json:", data);
            let icon = data.data.icon_img;
            const icon2 = data.data.community_icon;
            if (icon === "") {
                icon = icon2;
            }
            icon = icon.replace(/\?.*/, "");
            console.log("selected icon", icon);
            if (icon !== undefined || icon === "") {
                const img = document.getElementById("header-img");
                if (img.nodeName.toLowerCase() === "img") {
                    img.src = icon;
                    img.setAttribute("width", 32);
                    img.setAttribute("height", 32);
                } else if (img.nodeName.toLowerCase() === "a") {
                    img.style.backgroundImage = `url(${icon})`;
                    img.style.backgroundSize = "100% 100%";
                    img.style.backgroundPosition = "center";
                } else {
                    console.error("unknown icon type", img.nodeName);
                }
            }
        });
}
document.addEventListener("DOMContentLoaded", function onDOMContentLoaded() {
    fetchSubredditLogo();
});
