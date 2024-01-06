import ExpandoProvider from "./expandoProvider";

// type ImageMetadata = {
//     // y: number;
//     // x: number;
//     u: string;
// };

type MediaMetadataItem = {
    // status: string,
    // e: string,
    m: string;
    // p: unknown[]; //ImageMetadata[];
    // s: ImageMetadata,
    id: string;
};

export default class RedditGallery implements ExpandoProvider {
    sitename = "Reddit Gallery";
    urlregex = new RegExp(/https:\/\/www\.reddit\.com\/gallery\/.{7}/);
    async createGalleryData(post: HTMLDivElement) {
        const postLink = post.dataset.permalink;
        const jsonUrl = `https://old.reddit.com${postLink}.json`;
        console.log(jsonUrl);
        const response = await fetch(jsonUrl, {
            referrerPolicy: "no-referrer",
        });
        if (!response.ok) {
            console.log(response);
            throw new Error("Error in fetching gallery json data");
        }
        const responseJson = await response.json();
        const postData = responseJson[0].data.children[0].data;
        console.debug("postData is", postData);

        const galleryItems: { media_id: string; caption: string }[] =
            postData.gallery_data.items;
        const mediaMetadata = postData.media_metadata;
        return galleryItems.map(({ media_id, caption }) =>
            this.getGalleryEntryData(mediaMetadata[media_id], caption)
        );
    }

    private getGalleryEntryData(imgData: MediaMetadataItem, caption: string) {
        const imgFileExtension = imgData.m.split("/")[1];
        const imageSrc = `https://i.redd.it/${imgData.id}.${imgFileExtension}`; // there is probably a better way!

        const link = document.createElement("a");
        link.classList.add("galleryLink");
        link.href = imageSrc;
        link.innerText = "link to original image";

        const desc = document.createElement("div");
        if (caption) {
            desc.innerText = caption;
        }
        return {
            imageSrc: imageSrc,
            imageDescHtml: desc.outerHTML + link.outerHTML,
        };
    }
}
