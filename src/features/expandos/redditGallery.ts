import BaseExpando from "./baseGallery";

type ImageMetadata = {
    // y: number;
    // x: number;
    u: string;
};

function isImageMetadata(item: unknown): item is ImageMetadata {
    return item instanceof Object && "u" in item && typeof item.u === "string";
}

type MediaMetadataItem = {
    // status: string,
    // e: string,
    m: string;
    p: unknown[]; //ImageMetadata[];
    // s: ImageMetadata,
    id: string;
};

function isMediaMetadataItem(item: unknown): item is MediaMetadataItem {
    return (
        item instanceof Object &&
        "m" in item &&
        typeof item.m === "string" &&
        "p" in item &&
        Array.isArray(item.p) &&
        "id" in item &&
        typeof item.id === "string"
    );
}

export default class RedditGallery extends BaseExpando {
    sitename = "Reddit Gallery";
    urlregex = new RegExp(/https:\/\/www\.reddit\.com\/gallery\/.{7}/);
    async createGalleryData(post: HTMLDivElement) {
        const postUrl =
            post.querySelector<HTMLAnchorElement>(".comments").href + ".json";
        console.log("postUrl json url", postUrl);
        const response = await fetch(postUrl, {
            referrerPolicy: "no-referrer",
        });
        let postData = await response.json();
        if (Array.isArray(postData)) {
            postData = postData[0];
        }
        console.log(postData);
        const imgMap = new Map<string, string>();
        for (const imgData of Object.values(
            postData.data.children[0].data.media_metadata
        )) {
            if (!isMediaMetadataItem(imgData)) return;
            const lastImageMetadata = imgData.p.at(-1);
            if (!isImageMetadata(lastImageMetadata)) return;

            const link = document.createElement("a");
            const imgFileExtension = imgData.m.split("/")[1];
            link.href = `https://i.redd.it/${imgData.id}.${imgFileExtension}`; // there is probably a better way!
            link.innerText = "original image";
            imgMap.set(lastImageMetadata.u, link.outerHTML);
        }
        return imgMap;
    }
}
