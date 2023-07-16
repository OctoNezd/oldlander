import BaseExpando from "./baseGallery";
function doWeHavePostOpen(post) {
    return location.pathname.includes(post.getAttribute("data-fullname"));
}
export default class RedditGallery extends BaseExpando {
    sitename = "Reddit Gallery";
    urlregex = new RegExp(/https:\/\/www\.reddit\.com\/gallery\/.{7}/);
    async createGalleryData(post) {
        let postUrl;
        if (!doWeHavePostOpen(post)) {
            postUrl = post.querySelector(".comments").href + ".json";
        } else {
            postUrl = new URL(location.toString());
            postUrl.hash = "";
            postUrl.pathname += ".json";
        }
        console.log(postUrl, fetch);
        let postData = await (
            await fetch(postUrl, {
                referrerPolicy: "no-referrer",
            })
        ).json();
        if (Array.isArray(postData)) {
            postData = postData[0];
        }
        console.log(postData);
        const imgMap = new Map();
        for (const imgData of Object.values(
            postData.data.children[0].data.media_metadata
        )) {
            const link = document.createElement("a");
            link.href = `https://i.redd.it/${imgData.id}.${
                imgData.m.split("/")[1]
            }`; // there is probably a better way!
            link.innerText = "link to original image";
            imgMap.set(imgData.p.at(-1).u, link.outerHTML);
        }
        return imgMap;
    }
}
