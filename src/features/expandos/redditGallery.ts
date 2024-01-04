import { OrderedMap } from "immutable";
import ExpandoProvider from "./expandoProvider";

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

export default class RedditGallery implements ExpandoProvider {
    sitename = "Reddit Gallery";
    urlregex = new RegExp(/https:\/\/www\.reddit\.com\/gallery\/.{7}/);
    async createGalleryData(post: HTMLDivElement) {
        let imgMap = OrderedMap<string, string>();
        const unsortedImgMap = new Map<string, Array<string>>();

        const commentsLink = post.querySelector<HTMLAnchorElement>(".comments");
        if (!commentsLink) {
            console.error("Couldn't find comments link!");
            return imgMap;
        }

        const postUrl = commentsLink.href + ".json";
        console.log("postUrl json url", postUrl);
        const response = await fetch(postUrl, {
            referrerPolicy: "no-referrer",
        });
        let postData = await response.json();
        if (Array.isArray(postData)) {
            postData = postData[0];
        }
        console.log(postData);
        postData = postData.data.children[0].data
        for (const imgData of Object.values(
            postData.media_metadata
        )) {
            if (!isMediaMetadataItem(imgData)) continue;
            const lastImageMetadata = imgData.p.at(-1);
            if (!isImageMetadata(lastImageMetadata)) continue;

            const link = document.createElement("a");
            link.classList.add("galleryLink")
            const imgFileExtension = imgData.m.split("/")[1];
            link.href = `https://i.redd.it/${imgData.id}.${imgFileExtension}`; // there is probably a better way!
            link.innerText = "link to original image";
            unsortedImgMap.set(imgData.id, [lastImageMetadata.u, link.outerHTML]);
        }
        for (const { media_id, caption } of postData.gallery_data.items) {
            console.log("looking up", media_id)
            if (unsortedImgMap.has(media_id)) {
                // @ts-ignore
                const galleryItem: [desc: string, html: string] = unsortedImgMap.get(media_id)
                const desc = document.createElement("div");
                if (caption !== undefined) {
                    desc.innerText = caption
                }
                imgMap = imgMap.set(galleryItem[0], desc.outerHTML + galleryItem[1])
            }
        }
        return imgMap;
    }
}
